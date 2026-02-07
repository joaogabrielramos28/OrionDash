export interface RabbitMQMessage<T = any> {
  pattern: string;
  data: T;
  metadata?: {
    correlationId?: string;
    timestamp?: number;
    userId?: string;
    retryCount?: number;
  };
}
