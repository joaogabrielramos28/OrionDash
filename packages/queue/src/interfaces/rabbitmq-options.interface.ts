export interface RabbitMQModuleOptions {
  url: string;
  exchanges?: ExchangeConfig[];
  queues?: QueueConfig[];
  prefetchCount?: number;
}

export interface ExchangeConfig {
  name: string;
  type: "direct" | "topic" | "fanout" | "headers";
  options?: {
    durable?: boolean;
    autoDelete?: boolean;
  };
}

export interface QueueConfig {
  name: string;
  exchange: string;
  routingKey: string;
  options?: {
    durable?: boolean;
    deadLetterExchange?: string;
    deadLetterRoutingKey?: string;
    messageTtl?: number;
    maxLength?: number;
  };
}
