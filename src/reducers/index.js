import { combineReducers } from "redux";
import { reducer as reduxFormReducer } from 'redux-form';

export const opcoesMenuReducer = (perfil) => {
  return [
    { perfil: "administrador", label: "Dentistas", acao: "adminDent" },
    { perfil: "administrador", label: "Auxiliares", acao: "adminAux" },
    { perfil: "administrador", label: "Pacientes", acao: "adminPac" },
    { perfil: "administrador", label: "Procedimentos", acao: "adminProc" },
    { perfil: "administrador", label: "Atendimentos", acao: "adminAtend" },
    { perfil: "administrador", label: "Relatório", acao: "adminRel" },
    { perfil: "administrador", label: "Agenda", acao: "adminAgenda" },
    //
    { perfil: "dentista", label: "Atendimentos", acao: "dentAtd" },
    { perfil: "dentista", label: "Pacientes", acao: "dentPac" },
    //
    { perfil: "auxiliar", label: "Atendimentos", acao: "auxAtd" },
    { perfil: "auxiliar", label: "Pacientes", acao: "auxPac" },
    //
  ];
};

export const opcaoSelecionadaMenuReducer = (opcao = null, action) => {
  if (action.type === "MENU_SELECT") {
    return action.payload;
  }
  return opcao;
};

export const setTokenReducer = (token = null, action) => {
  if (action.type === "SET_TOKEN") {
    return action.payload;
  }
  return token;
};

export const perfilReducer = (perfil = null, action) => {
  if (action.type === "PERFIL") {
    return action.payload;
  }
  return perfil;
};

export const messageReducer = (message = null, action) => {
  if (action.type === "MESSAGE") {
    return action.payload;
  }
  return message;
};

export const telaReducer = (tela = null, action) => {
  if (action.type === "TELA") {
    return action.payload;
  }
  return tela;
};

export default combineReducers({
  form: reduxFormReducer,
  opcoesMenu: opcoesMenuReducer,
  opcaoSelecionadaMenu: opcaoSelecionadaMenuReducer,
  setToken: setTokenReducer,
  perfil: perfilReducer,
  message: messageReducer,
  tela: telaReducer,
});
