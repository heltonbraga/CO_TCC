export const validarCPF = (strCPF) => {
  let Soma;
  let Resto;
  Soma = 0;
  if (strCPF === "00000000000") {
    return false;
  }
  for (let i = 1; i <= 9; i++) {
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  }
  Resto = (Soma * 10) % 11;
  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }
  if (Resto !== parseInt(strCPF.substring(9, 10))) {
    return false;
  }
  Soma = 0;
  for (let i = 1; i <= 10; i++) {
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  }
  Resto = (Soma * 10) % 11;
  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }
  return Resto === parseInt(strCPF.substring(10, 11));
};

export const validate = (values) => {
  const errors = {};

  const MSG_REQUIRED = "Obrigatório";
  const MSG_INVALID = " inválido";
  const MSG_ATLEAST = "Informe um ou mais";

  if (!values.procedimentosHabilitados || values.procedimentosHabilitados.length === 0) {
    errors.procedimentosHabilitados = MSG_ATLEAST;
  }

  if (!values.horariosDisponiveis || values.horariosDisponiveis.length === 0) {
    errors.horariosDisponiveis = MSG_ATLEAST;
  }

  if (!values.nome) {
    errors.nome = MSG_REQUIRED;
  }

  if (!values.vaga) {
    errors.vaga = MSG_REQUIRED;
  }

  if (!values.convenio) {
    errors.convenio = MSG_REQUIRED;
  }

  if (!values.formacao) {
    errors.formacao = MSG_REQUIRED;
  }

  if (!values.cpf) {
    errors.cpf = MSG_REQUIRED;
  } else if (
    !/^(\d{3})+\.(\d{3})+\.(\d{3})+-(\d{2})$/i.test(values.cpf) ||
    !validarCPF(values.cpf.replace(".", "").replace(".", "").replace("-", ""))
  ) {
    errors.cpf = "cpf" + MSG_INVALID;
  }

  if (!values.tel1) {
    errors.tel1 = MSG_REQUIRED;
  } else if (!/^\((\d{2})\) (\d{5}) (\d{4})$/i.test(values.tel1)) {
    errors.tel1 = "cell" + MSG_INVALID;
  }

  if (!values.email) {
    errors.email = MSG_REQUIRED;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "email" + MSG_INVALID;
  }

  if (!values.cep) {
    errors.cep = MSG_REQUIRED;
  } else if (!/^(\d{2})\.(\d{3})-(\d{3})$/i.test(values.cep)) {
    errors.cep = "cep" + MSG_INVALID;
  }

  if (
    (values.banco || values.agencia || values.conta) &&
    (!values.banco || !values.agencia || !values.conta)
  ) {
    errors.banco = MSG_REQUIRED;
    errors.agencia = MSG_REQUIRED;
    errors.conta = MSG_REQUIRED;
  }

  if (!values.cro) {
    errors.cro = MSG_REQUIRED;
  }

  return errors;
};
