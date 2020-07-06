import { combineReducers } from "redux";

export const opcoesMenuReducer = (perfil) => {
  return [
    { perfil: "administrador", label: "Dentistas", acao: "adminDent" },
    { perfil: "administrador", label: "Auxiliares", acao: "adminAux" },
    { perfil: "administrador", label: "Procedimentos", acao: "adminProc" },
    { perfil: "administrador", label: "Relatório", acao: "adminRel" },
    { perfil: "administrador", label: "Agenda", acao: "adminAgenda" },
    //
    { perfil: "dentista", label: "Atendimentos", acao: "dentAtd" },
    { perfil: "dentista", label: "Pacientes", acao: "dentPac" },
    //
    { perfil: "auxiliar", label: "Atendimentos", acao: "auxAtd" },
    { perfil: "auxiliar", label: "Pacientes", acao: "auxPac" },
    //
    { perfil: "paciente", label: "Atendimento", acao: "pacAtd" },
  ];
};

export const opcaoSelecionadaMenuReducer = (opcao = null, action) => {
  if (action.type === "MENU_SELECT") {
    return action.payload;
  }
  return opcao;
};

export default combineReducers({
  opcoesMenu: opcoesMenuReducer,
  opcaoSelecionadaMenu: opcaoSelecionadaMenuReducer,
});
