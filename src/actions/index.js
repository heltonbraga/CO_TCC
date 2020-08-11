export const menuSelect = (opcaoMenu) => {
  return {
    type: "MENU_SELECT",
    payload: opcaoMenu,
  };
};

export const setToken = (token) => {
  return {
    type: "SET_TOKEN",
    payload: token,
  };
};

export const setMessage = (message) => {
  return {
    type: "MESSAGE",
    payload: message,
  };
};

export const setTela = (tela) => {
  console.log("nova tela: " + tela);
  return {
    type: "TELA",
    payload: tela,
  };
};
