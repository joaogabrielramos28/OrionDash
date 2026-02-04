enum OrderStatus {
  CREATED = "created",
  PENDING_PAYMENT = "pending_payment",
  PAYMENT_FAILED = "payment_failed",
  PAID = "paid",
  PENDING_DISPATCH = "pending_dispatch",
  DISPATCH_FAILED = "dispatch_failed",
  ASSIGNED = "assigned",
  PICKED_UP = "picked_up",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}
export { OrderStatus };
