1. Responsabilidade Geral
RF-00: O serviço deve ser a única fonte de verdade para transações financeiras, operando de forma independente do Orders Service.


2. Entrada e Mensageria (Consumo)
RF-01: Deve iniciar o fluxo de pagamento automaticamente ao consumir o evento order.created.
RF-02: Deve validar se o payload do evento contém os dados mínimos: orderId, amount, customerId e correlationId.
RF-03: Deve registrar uma intenção de pagamento no banco de dados com status PROCESSING antes de qualquer comunicação com gateways externos.
RF-04 (Idempotência): Deve garantir que um mesmo orderId não seja cobrado duas vezes caso a mensagem order.created seja recebida repetidamente.
RF-05: Deve rejeitar a mensagem (NACK) para a Dead Letter Queue (DLQ) em caso de falhas técnicas impeditivas (ex: banco de dados fora do ar).


3. Processamento de Cobrança
RF-06: Deve processar a cobrança através de um provedor de pagamento (inicialmente um simulador/mock).
RF-07: O simulador de pagamento deve suportar uma taxa de falha configurável (ex: 10% das transações falham) para testar fluxos de compensação da SAGA.
RF-08: Deve manter uma máquina de estados rigorosa para o pagamento: PROCESSING -> SUCCEEDED ou FAILED.
RF-09: Deve registrar o motivo da falha (failureReason) em caso de recusa do provedor (ex: saldo insuficiente, cartão expirado).


4. Persistência e Auditoria
RF-10: Deve persistir as seguintes informações para cada transação:
paymentId (UUID)
orderId (UUID)
amount (Decimal/BigInt)
status (Enum)
provider (String)
providerTransactionId (String - ID retornado pelo gateway)
correlationId (UUID - para rastreabilidade fim-a-fim)
RF-11: Deve armazenar logs estruturados de cada mudança de estado do pagamento.

5. Saída e Mensageria (Publicação)
RF-12: Deve publicar o evento payment.succeeded no exchange swiftsaga.events após a confirmação de sucesso pelo provedor.
RF-13: Deve publicar o evento payment.failed no exchange swiftsaga.events caso a cobrança seja negada ou ocorra um erro de negócio.
RF-14: Todos os eventos de saída devem obrigatoriamente carregar o correlationId original recebido no início do fluxo.
6. Consultas e Operação (API)
RF-15: Deve expor um endpoint GET /payments/order/:orderId para que o Frontend ou outros serviços consultem o status financeiro de um pedido.
RF-16: Deve expor um endpoint de Healthcheck (GET /health) que valide a conectividade com o Banco de Dados e o RabbitMQ.
RF-17: Deve permitir a configuração de variáveis de ambiente para: RABBITMQ_URL, DATABASE_URL e PAYMENT_FAILURE_RATE.