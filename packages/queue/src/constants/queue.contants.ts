export const QUEUES = {
  ORDER_PAYMENT_SUCCEEDED: "orders.payment.succeeded",
  PAYMENT_ORDER_CREATED: "payment.order-created",
  ORDER_PAYMENT_FAILED: "orders.payment.failed",
} as const;

export const EXCHANGES = {
  MAIN: "orion.events",
  DLX: "orion.dlx",
} as const;

export const ROUTING_KEYS = {
  ORDER_PAYMENT_SUCCEEDED: "payment.succeeded",
  ORDER_PAYMENT_SUCCEEDED_FAILED: "payment.succeeded.failed",
  ORDER_CREATED: "order.created",
  ORDER_CREATED_FAILED: "order.created.failed",
  ORDER_PAYMENT_FAILED: "payment.failed",
} as const;
