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

export const setPerfil = (perfil) => {
  return {
    type: "PERFIL",
    payload: perfil,
  };
};

export const setMessage = (message) => {
  return {
    type: "MESSAGE",
    payload: message,
  };
};

export const setTela = (tela) => {
  return {
    type: "TELA",
    payload: tela,
  };
};
