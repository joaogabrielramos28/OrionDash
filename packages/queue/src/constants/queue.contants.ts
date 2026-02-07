export const QUEUES = {
  ORDER_PAYMENT_SUCCEEDED: "orders.payment.succeeded",
} as const;

export const EXCHANGES = {
  MAIN: "orion.events",
  DLX: "orion.dlx",
} as const;

export const ROUTING_KEYS = {
  ORDER_PAYMENT_SUCCEEDED: "payment.succeeded",
  ORDER_PAYMENT_SUCCEEDED_FAILED: "payment.succeeded.failed",
  ORDER_CREATED: "order.created",
} as const;
