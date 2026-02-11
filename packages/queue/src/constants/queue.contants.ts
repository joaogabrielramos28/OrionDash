export const QUEUES = {
  ORDER_PAYMENT_SUCCEEDED: "orders.payment.succeeded",
  PAYMENT_ORDER_CREATED: "payment.order-created",
  ORDER_PAYMENT_FAILED: "orders.payment.failed",
  DISPATCH_ORDER_PAID: "dispatch.order-paid",
  DISPATCH_COURIER_STATUS_UPDATED: "dispatch.courier-status-updated",
} as const;

export const EXCHANGES = {
  MAIN: "orion.events",
  DLX: "orion.dlx",
} as const;

export const ROUTING_KEYS = {
  // Orders
  ORDER_CREATED: "order.created",
  ORDER_CREATED_FAILED: "order.created.failed",
  ORDER_PAID: "order.paid",
  ORDER_PAID_FAILED: "order.paid.failed",

  // Payment
  ORDER_PAYMENT_SUCCEEDED: "payment.succeeded",
  ORDER_PAYMENT_SUCCEEDED_FAILED: "payment.succeeded.failed",
  ORDER_PAYMENT_FAILED: "payment.failed",

  // Courier
  COURIER_STATUS_UPDATED: "courier.status_updated",
  COURIER_STATUS_UPDATED_FAILED: "courier.status_updated.failed",

  // Dispatch
  DISPATCH_ASSIGNED: "dispatch.assigned",
  DISPATCH_FAILED: "dispatch.failed",
} as const;
