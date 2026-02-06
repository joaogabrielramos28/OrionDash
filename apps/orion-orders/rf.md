RF01 - Criação de Pedido: O sistema deve permitir que um cliente crie um pedido contendo múltiplos itens de um único restaurante.
RF02 - Cálculo de Totais: O sistema deve calcular automaticamente o valor total do pedido, somando itens e suas respectivas customizações.
RF03 - Snapshot de Dados: Ao criar um pedido, o sistema deve salvar uma cópia imutável do endereço de entrega e dos dados dos produtos (nome e preço unitário).
RF04 - Fluxo de Status: O sistema deve gerenciar o ciclo de vida do pedido (Criado, Pago, Confirmado, Em Preparo, Saiu para Entrega, Entregue, Cancelado).
RF05 - Orquestração de SAGA: O sistema deve iniciar o processo de pagamento assim que um pedido for criado e, em caso de falha, realizar a compensação (cancelamento).
RF06 - Histórico do Cliente: O sistema deve permitir que o cliente consulte seu histórico de pedidos e o status atual de um pedido ativo.