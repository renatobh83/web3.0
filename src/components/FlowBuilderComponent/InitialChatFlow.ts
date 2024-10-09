const data = {
  nodeList: [
    {
      id: "configuracoes",
      type: "configuracao",

      position: { x: 340, y: 100 },
      deletable: false, // custom property to mark it as non-deletable
      draggable: false, // Não pode ser movido
      data: {
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
          destiny: null,
        },
        firstInteraction: {
          type: 1,
          destiny: null,
        },
        keyword: {
          message: "",
        },
      },
    },
  ],
  lineList: [],
};

export function getDefaultFlow() {
  return data;
}
