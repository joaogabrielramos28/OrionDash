import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import * as amqp from "amqp-connection-manager";
import { ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel, ConsumeMessage } from "amqplib";
import { RabbitMQMessage } from "./interfaces/message.interface.js";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.AmqpConnectionManager =
    {} as amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper = {} as ChannelWrapper;
  private readonly url: string;
  private readonly prefetchCount: number;

  constructor(url: string, prefetchCount = 10) {
    this.url = url;
    this.prefetchCount = prefetchCount;
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    this.logger.log(`🔌 Connecting to RabbitMQ at ${this.url}`);

    this.connection = amqp.connect([this.url], {
      heartbeatIntervalInSeconds: 30,
      reconnectTimeInSeconds: 5,
    });

    this.connection.on("connect", () => {
      this.logger.log("✅ Connected to RabbitMQ");
    });

    this.connection.on("disconnect", (err) => {
      this.logger.error("❌ Disconnected from RabbitMQ", err?.err.message);
    });

    this.connection.on("connectFailed", (err) => {
      this.logger.error("❌ Failed to connect to RabbitMQ", err?.err.message);
    });

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.prefetch(this.prefetchCount);
      },
    });
  }

  private async disconnect() {
    await this.channelWrapper?.close();
    await this.connection?.close();
    this.logger.log("🔌 Disconnected from RabbitMQ");
  }

  /**
   * Cria um exchange
   */
  async assertExchange(
    exchange: string,
    type: "direct" | "topic" | "fanout" | "headers" = "topic",
    options: { durable?: boolean; autoDelete?: boolean } = { durable: true },
  ) {
    await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
      await channel.assertExchange(exchange, type, options);
      this.logger.log(`📢 Exchange "${exchange}" (${type}) ASSERTED no Broker`);
    });
  }

  /**
   * Cria uma fila
   */
  async assertQueue(queue: string, options: any = { durable: true }) {
    await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
      const args: any = {};
      if (options.deadLetterExchange)
        args["x-dead-letter-exchange"] = options.deadLetterExchange;
      if (options.deadLetterRoutingKey)
        args["x-dead-letter-routing-key"] = options.deadLetterRoutingKey;

      await channel.assertQueue(queue, {
        durable: options.durable ?? true,
        arguments: Object.keys(args).length > 0 ? args : undefined,
      });
      this.logger.log(`📦 Queue "${queue}" ASSERTED no Broker`);
    });
  }

  /**
   * Faz bind
   */
  async bindQueue(queue: string, exchange: string, routingKey: string) {
    await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
      await channel.bindQueue(queue, exchange, routingKey);
      this.logger.log(`🔗 Bind "${queue}" -> "${exchange}" ASSERTED`);
    });
  }

  /**
   * Publica uma mensagem
   */
  async publish<T = any>(
    exchange: string,
    routingKey: string,
    data: T,
    options?: {
      correlationId?: string;
      userId?: string;
      persistent?: boolean;
    },
  ) {
    const message: RabbitMQMessage<T> = {
      pattern: routingKey,
      data,
      metadata: {
        correlationId: options?.correlationId ?? this.generateId(),
        timestamp: Date.now(),
        userId: options?.userId,
      },
    };

    await this.channelWrapper.publish(exchange, routingKey, message, {
      persistent: options?.persistent ?? true,
      contentType: "application/json",
      correlationId: message?.metadata?.correlationId,
    });

    this.logger.debug(`📤 Published to ${exchange}/${routingKey}`, {
      correlationId: message?.metadata?.correlationId,
    });

    return message?.metadata?.correlationId;
  }

  /**
   * Consome mensagens de uma fila
   */
  async subscribe<T = any>(
    queue: string,
    handler: (data: T, message: RabbitMQMessage<T>) => Promise<void>,
  ) {
    await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
      await channel.consume(
        queue,
        async (msg: ConsumeMessage | null) => {
          if (!msg) return;

          const startTime = Date.now();
          let content: RabbitMQMessage<T>;

          try {
            content = JSON.parse(msg.content.toString());

            this.logger.debug(`📥 Received message from ${queue}`, {
              correlationId: content.metadata?.correlationId,
            });

            await handler(content.data, content);

            channel.ack(msg);

            const duration = Date.now() - startTime;
            this.logger.debug(
              `✅ Message processed from ${queue} in ${duration}ms`,
              { correlationId: content.metadata?.correlationId },
            );
          } catch (error) {
            this.logger.error(
              `❌ Error processing message from ${queue}`,
              error instanceof Error ? error.stack : error,
            );

            channel.nack(msg, false, false);
          }
        },
        { noAck: false },
      );
    });

    this.logger.log(`👂 Subscribed to queue "${queue}"`);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
