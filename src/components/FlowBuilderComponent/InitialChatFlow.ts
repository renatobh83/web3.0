const data = {
  nodeList: [
    {
      id: "configurations",
      type: "configurations",
      position: { x: 340, y: 100 },
      deletable: false, // custom property to mark it as non-deletable
      draggable: false, // Não pode ser movido
      data: {
        label: "Configuracoes",
        notOptionsSelectMessage: {
          message: "",
          stepReturn: "A",
        },
        notResponseMessage: {
          time: 10,
          type: 1,
          destiny: "",
          message: "",
        },
        welcomeMessage: {
          message: "",
        },
        farewellMessage: {
          message: "",
        },
        maxRetryBotMessage: {
          number: 3,
          type: 1,
          destiny: "",
        },
        outOpenHours: {
          type: 1,
          destiny: "",
        },
        firstInteraction: {
          type: 1,
          destiny: "",
        },
        keyword: {
          message: "",
        },
      },
    },
    {
      id: "start",
      data: { label: "Inicio" },
      type: "start",
      position: { x: 90, y: 135 },
      deletable: false, // custom property to mark it as non-deletable
      draggable: false, // Não pode ser movido
    },
    {
      id: "nodeC",
      type: "boasVindas",
      position: { x: 225, y: 210 },
      deletable: false, // custom property to mark it as non-deletable
      draggable: false, // Não pode ser movido
      data: {
        label: "Boas vindas!",
        interactions: [],
        conditions: [],
        actions: [],
      },
    },
  ],
  lineList: [
    {
      type: "default",
      source: "start",
      target: "nodeC",
      id: "xy-edge__start-nodeCleft",
    },
  ],
};

export function getDefaultFlow() {
  // Cria um novo ID único para o flow, por exemplo, usando timestamp ou alguma outra lógica
  const flowId = Date.now(); // Exemplo simples de ID único

  // Faz uma cópia profunda de 'data' para garantir que novos fluxos não compartilhem referências a objetos
  const newFlow = JSON.parse(JSON.stringify(data));

  // Gera um ID exclusivo para cada nó e associa ao novo fluxo
  newFlow.nodeList = newFlow.nodeList.map((node) => ({
    ...node,
    chatflow: `${flowId}`, // Adiciona a propriedade 'chatflow' exclusiva para esse flow
  }));

  return newFlow;
}
