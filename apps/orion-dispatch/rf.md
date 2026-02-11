RF-01 (Atribuição): Ao receber order.paid, deve buscar entregadores disponíveis em um raio de distância (no V1, vamos apenas pegar o primeiro disponível).
RF-02 (Resiliência): Se não encontrar entregador de imediato, deve tentar novamente após X segundos (Retry Loop).
RF-03 (Timeout): Se após 5 minutos nenhum entregador aceitar, deve publicar dispatch.failed (para o Orders cancelar o pedido e o Payment estornar — SAGA de compensação).
RF-04 (Confirmação): Ao encontrar um entregador, publica dispatch.assigned.