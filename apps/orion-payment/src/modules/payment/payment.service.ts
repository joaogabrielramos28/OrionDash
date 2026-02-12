import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessPaymentDTO } from './dto/process.dto';
import { OrderStatus } from '@orion/contracts';
import { EXCHANGES, RabbitMQService, ROUTING_KEYS } from '@orion/queue';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly rabbit: RabbitMQService,
  ) {}

  async processPayment(data: ProcessPaymentDTO) {
    const existing = await this.paymentRepository.findOne({
      where: { orderId: data.orderId },
    });

    if (existing && existing.status === OrderStatus.PAID) return;
    const payment = this.paymentRepository.create({
      amount: data.amount,
      correlationId: data.correlationId,
      orderId: data.orderId,
      status: OrderStatus.PROCESSING,
    });

    await this.paymentRepository.save(payment);

    const isSuccess = Math.random() > 0.2; // 80% de chance de sucesso
    await new Promise((res) => setTimeout(res, 2000)); // Simula delay de rede

    if (isSuccess) {
      payment.status = OrderStatus.PAID;
      payment.providerTransactionId = `PAY-${Math.random().toString(36).toUpperCase()}`;
      await this.paymentRepository.save(payment);

      await this.rabbit.publish(
        EXCHANGES.MAIN,
        ROUTING_KEYS.ORDER_PAYMENT_SUCCEEDED,
        {
          orderId: payment.orderId,
          paymentId: payment.id,
          amount: payment.amount,
        },
        { correlationId: data.correlationId },
      );

      return;
    }

    payment.status = OrderStatus.PAYMENT_FAILED;
    await this.paymentRepository.save(payment);

    await this.rabbit.publish(
      EXCHANGES.MAIN,
      ROUTING_KEYS.ORDER_PAYMENT_FAILED,
      {
        orderId: payment.orderId,
      },
      { correlationId: data.correlationId },
    );
  }

  async processRefund(orderId: string) {
    const existing = await this.paymentRepository.findOne({
      where: { orderId },
    });

    if (!existing || existing.status !== OrderStatus.PAID) {
      throw new Error(
        'Pagamento não encontrado ou não é elegível para reembolso',
      );
    }

    existing.status = OrderStatus.REFUNDED;
    await this.paymentRepository.save(existing);
  }
}
