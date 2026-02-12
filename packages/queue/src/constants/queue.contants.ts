export const QUEUES = {
  ORDER_PAYMENT_SUCCEEDED: "orders.payment.succeeded",
  PAYMENT_ORDER_CREATED: "payment.order-created",
  ORDER_PAYMENT_FAILED: "orders.payment.failed",
  DISPATCH_ORDER_PAID: "dispatch.order-paid",
  DISPATCH_COURIER_STATUS_UPDATED: "dispatch.courier-status-updated",
  COURIER_ASSIGNMENT_REQUESTED: "courier.assignment-requested",
  DISPATCH_FAILED: "dispatch.failed",
  ORDER_PAYMENT_REFUNDED: "orders.payment.refunded",
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
  ORDER_REFUNDED: "order.refunded",
  ORDER_REFUNDED_FAILED: "order.refunded.failed",

  // Payment
  ORDER_PAYMENT_SUCCEEDED: "payment.succeeded",
  ORDER_PAYMENT_SUCCEEDED_FAILED: "payment.succeeded.failed",
  ORDER_PAYMENT_FAILED: "payment.failed",
  ORDER_PAYMENT_REFUNDED: "payment.refunded",
  ORDER_PAYMENT_REFUNDED_FAILED: "payment.refunded.failed",

  // Courier
  COURIER_STATUS_UPDATED: "courier.status_updated",
  COURIER_STATUS_UPDATED_FAILED: "courier.status_updated.failed",
  COURIER_ASSIGNMENT_REQUESTED: "courier.assignment_requested",
  COURIER_ASSIGNMENT_REQUESTED_FAILED: "courier.assignment_requested.failed",

  // Dispatch
  DISPATCH_ASSIGNED: "dispatch.assigned",
  DISPATCH_FAILED: "dispatch.failed",
} as const;
