import React from "react";
import { Text, View } from "@react-pdf/renderer";

export const formatar = (value, format) => {
  if (!value) return undefined;
  let val = value;
  if (format.slice(0, 1) === ":") {
    val = val.slice(parseInt(format.slice(1)));
  }
  if (format === "num") {
    val = val.replace(/(\D)/g, "");
  }
  if (format === "cpf") {
    val = val.replace(/(\D)/g, "");
    val = val.slice(-11);
    val = val.replace(/(\d{3})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  if (format === "cell") {
    val = val.replace(/(\D)/g, "");
    val = val.slice(-11);
    val = val.replace(/(\d{2})(\d)/, "($1) $2");
    val = val.replace(/(\d{5})(\d)/, "$1 $2");
  }
  if (format === "fixo") {
    val = val.replace(/(\D)/g, "");
    val = val.slice(-10);
    val = val.replace(/(\d{2})(\d)/, "($1) $2");
    val = val.replace(/(\d{4})(\d)/, "$1 $2");
  }
  if (format === "cep") {
    val = val.replace(/(\D)/g, "");
    val = val.slice(-8);
    val = val.replace(/(\d{2})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d)/, "$1-$2");
  }
  if (format === "agencia") {
    val = val.replace(/(\D)/g, "");
    val = val.length > 1 ? val.slice(0, val.length - 1) + "-" + val.slice(-1) : val;
  }
  if (format === "dt") {
    val = val.slice(0, 10);
  }
  return val;
};

export const mapDentistaFormToRequest = (formData, idDentista, idAdmin) => {
  let val = formData;
  let bank = { banco: val.banco, agencia: val.agencia, conta: val.conta };
  let pess = {
    id: idDentista,
    nome: val.nome,
    nr_cpf: val.cpf.replace(/(\D)/g, ""),
    sexo: val.sexo,
    dt_nascimento: val.nascimento,
    //
    email: val.email,
    nr_tel: val.tel1,
    nr_tel_2: val.tel2,
    //
    nr_cep: val.cep.replace(/(\D)/g, ""),
    sg_uf: val.estado,
    nm_cidade: val.cidade,
    de_endereco: val.endereco,
    de_endereco_comp: val.complemento,
    //
    dadosBancarios: bank,
  };
  let proc = val.procedimentosHabilitados
    ? val.procedimentosHabilitados.map((p) => {
        return { procedimento_id: p.id };
      })
    : [];
  let disp = val.horariosDisponiveis
    ? val.horariosDisponiveis.map((d) => {
        return {
          dm_dia_semana: d.dia_str.toLowerCase(),
          hr_inicio: d.inicio_str,
          hr_fim: d.fim_str,
        };
      })
    : [];
  let data = {
    admin: idAdmin,
    id: idDentista,
    nr_cro: val.cro,
    dt_liberacao: val.liberacao,
    dt_bloqueio: val.bloqueio,
    pessoa: pess,
    procedimentos: proc,
    disponibilidades: disp,
  };
  return data;
};

export const mapDentistaResponseToForm = (data) => {
  if (!data) {
    return undefined;
  }
  let d = data;
  let bancoPessoa =
    d.Pessoa.DadosBancarios && d.Pessoa.DadosBancarios.length > 0
      ? d.Pessoa.DadosBancarios[0]
      : { banco_codigo: undefined, agencia: undefined, conta: undefined };
  let dentista = {
    id: d.id,
    bloqueio: formatar(d.dt_bloqueio, "dt"),
    liberacao: formatar(d.dt_liberacao, "dt"),
    cro: d.nr_cro,
    //
    nome: d.Pessoa.nome,
    cpf: formatar("0000000000" + d.Pessoa.nr_cpf, "cpf"),
    nascimento: formatar(d.Pessoa.dt_nascimento, "dt"),
    sexo: d.Pessoa.sexo,
    //
    cep: formatar("000000" + d.Pessoa.nr_cep, "cep"),
    estado: d.Pessoa.sg_uf,
    cidade: d.Pessoa.nm_cidade,
    endereco: d.Pessoa.de_endereco,
    complemento: d.Pessoa.de_endereco_comp,
    //
    email: d.Pessoa.email,
    tel1: formatar(d.Pessoa.nr_tel, "cell"),
    tel2: formatar(d.Pessoa.nr_tel_2, "fixo"),
    //
    procedimentosHabilitados: d.Procedimentos,
    horariosDisponiveis: d.Disponibilidades,
    //
    banco: bancoPessoa.banco_codigo,
    agencia: bancoPessoa.agencia,
    conta: bancoPessoa.conta,
  };
  return dentista;
};

export const mapDentistaToExcel = (data) => {
  let d = data;
  return {
    nome: d.Pessoa.nome,
    cro: d.nr_cro,
    bloqueio: formatar(d.dt_bloqueio, "dt"),
    liberacao: formatar(d.dt_liberacao, "dt"),
    cpf: formatar("0000000000" + d.Pessoa.nr_cpf, "cpf"),
    nascimento: formatar(d.Pessoa.dt_nascimento, "dt"),
    sexo: d.Pessoa.sexo,
    //
    cep: formatar("000000" + d.Pessoa.nr_cep, "cep"),
    estado: d.Pessoa.sg_uf,
    cidade: d.Pessoa.nm_cidade,
    endereco: d.Pessoa.de_endereco,
    complemento: d.Pessoa.de_endereco_comp,
    //
    email: d.Pessoa.email,
    celular: formatar(d.Pessoa.nr_tel, "cell"),
    fixo: formatar(d.Pessoa.nr_tel_2, "fixo"),
    //
    dados_bancarios:
      d.Pessoa.DadosBancarios && d.Pessoa.DadosBancarios.length > 0
        ? d.Pessoa.DadosBancarios[0].banco_codigo +
          "/" +
          d.Pessoa.DadosBancarios[0].agencia +
          "/" +
          d.Pessoa.DadosBancarios[0].conta
        : null,
    //
    procedimentos: d.Procedimentos ? d.Procedimentos.map((p) => p.nome).join(", ") : null,
    horarios: d.Disponibilidades
      ? d.Disponibilidades.map(
          (p) => p.dm_dia_semana + " de " + p.hr_inicio + " às " + p.hr_fim
        ).join(", ")
      : null,
  };
};

export const mapDentistaToPdf = (data) => {
  const mapped = mapDentistaToExcel(data);
  return (
    <View
      style={{
        margin: 20,
        padding: 2,
        flexGrow: 1,
      }}
    >
      <Text
        style={{
          margin: 12,
          fontSize: 30,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        CO-TCC - Dados cadastrais
      </Text>
      <Text>Nome: {mapped.nome}</Text>
      <Text>CPF: {mapped.cpf}</Text>
      <Text>Sexo: {mapped.sexo}</Text>
      <Text>Data de nascimento: {mapped.nascimento}</Text>
      <Text>Email: {mapped.email}</Text>
      <Text>Celular: {mapped.celular}</Text>
      <Text>Fixo: {mapped.fixo}</Text>
      <Text>CEP: {mapped.cep}</Text>
      <Text>Estado: {mapped.estado}</Text>
      <Text>Cidade: {mapped.cidade}</Text>
      <Text>Endereço: {mapped.endereco}</Text>
      <Text>Complemento: {mapped.complemento}</Text>
      <Text>Dados bancários: {mapped.dados_bancarios}</Text>
      <Text> </Text>
      <Text>CRO: {mapped.cro}</Text>
      <Text>Data de liberação: {mapped.liberacao}</Text>
      <Text>Data de bloqueio: {mapped.bloqueio}</Text>
      <Text> </Text>
      <Text>Procedimentos: {mapped.procedimentos}</Text>
      <Text> </Text>
      <Text>Horários: </Text>
      {mapped.horarios.split(", ").map((h) => (
        <Text key={h}>{" * " + h}</Text>
      ))}
    </View>
  );
};

export const mapAuxiliarFormToRequest = (formData, idAuxiliar, idAdmin) => {
  let val = formData;
  let bank = { banco: val.banco, agencia: val.agencia, conta: val.conta };
  let pess = {
    id: idAuxiliar,
    nome: val.nome,
    nr_cpf: val.cpf.replace(/(\D)/g, ""),
    sexo: val.sexo,
    dt_nascimento: val.nascimento,
    //
    email: val.email,
    nr_tel: val.tel1,
    nr_tel_2: val.tel2,
    //
    nr_cep: val.cep.replace(/(\D)/g, ""),
    sg_uf: val.estado,
    nm_cidade: val.cidade,
    de_endereco: val.endereco,
    de_endereco_comp: val.complemento,
    //
    dadosBancarios: bank,
  };
  let data = {
    admin: idAdmin,
    id: idAuxiliar,
    nr_cro: val.cro,
    dm_formacao: val.formacao,
    pessoa: pess,
  };
  return data;
};

export const mapAuxiliarResponseToForm = (data) => {
  if (!data) {
    return undefined;
  }
  let d = data;
  let bancoPessoa =
    d.Pessoa.DadosBancarios && d.Pessoa.DadosBancarios.length > 0
      ? d.Pessoa.DadosBancarios[0]
      : { banco_codigo: undefined, agencia: undefined, conta: undefined };
  let auxiliar = {
    id: d.id,
    formacao: d.dm_formacao,
    cro: d.nr_cro,
    //
    nome: d.Pessoa.nome,
    cpf: formatar("0000000000" + d.Pessoa.nr_cpf, "cpf"),
    nascimento: formatar(d.Pessoa.dt_nascimento, "dt"),
    sexo: d.Pessoa.sexo,
    //
    cep: formatar("000000" + d.Pessoa.nr_cep, "cep"),
    estado: d.Pessoa.sg_uf,
    cidade: d.Pessoa.nm_cidade,
    endereco: d.Pessoa.de_endereco,
    complemento: d.Pessoa.de_endereco_comp,
    //
    email: d.Pessoa.email,
    tel1: formatar(d.Pessoa.nr_tel, "cell"),
    tel2: formatar(d.Pessoa.nr_tel_2, "fixo"),
    //
    banco: bancoPessoa.banco_codigo,
    agencia: bancoPessoa.agencia,
    conta: bancoPessoa.conta,
  };
  return auxiliar;
};

export const mapAuxiliarToExcel = (data) => {
  let d = data;
  return {
    nome: d.Pessoa.nome,
    cro: d.nr_cro,
    formacao: d.dm_formacao,
    cpf: formatar("0000000000" + d.Pessoa.nr_cpf, "cpf"),
    nascimento: formatar(d.Pessoa.dt_nascimento, "dt"),
    sexo: d.Pessoa.sexo,
    //
    cep: formatar("000000" + d.Pessoa.nr_cep, "cep"),
    estado: d.Pessoa.sg_uf,
    cidade: d.Pessoa.nm_cidade,
    endereco: d.Pessoa.de_endereco,
    complemento: d.Pessoa.de_endereco_comp,
    //
    email: d.Pessoa.email,
    celular: formatar(d.Pessoa.nr_tel, "cell"),
    fixo: formatar(d.Pessoa.nr_tel_2, "fixo"),
    //
    dados_bancarios:
      d.Pessoa.DadosBancarios && d.Pessoa.DadosBancarios.length > 0
        ? d.Pessoa.DadosBancarios[0].banco_codigo +
          "/" +
          d.Pessoa.DadosBancarios[0].agencia +
          "/" +
          d.Pessoa.DadosBancarios[0].conta
        : null,
  };
};

export const mapAuxiliarToPdf = (data) => {
  const mapped = mapAuxiliarToExcel(data);
  return (
    <View
      style={{
        margin: 20,
        padding: 2,
        flexGrow: 1,
      }}
    >
      <Text
        style={{
          margin: 12,
          fontSize: 30,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        CO-TCC - Dados cadastrais
      </Text>
      <Text>Nome: {mapped.nome}</Text>
      <Text>CPF: {mapped.cpf}</Text>
      <Text>Sexo: {mapped.sexo}</Text>
      <Text>Data de nascimento: {mapped.nascimento}</Text>
      <Text>Email: {mapped.email}</Text>
      <Text>Celular: {mapped.celular}</Text>
      <Text>Fixo: {mapped.fixo}</Text>
      <Text>CEP: {mapped.cep}</Text>
      <Text>Estado: {mapped.estado}</Text>
      <Text>Cidade: {mapped.cidade}</Text>
      <Text>Endereço: {mapped.endereco}</Text>
      <Text>Complemento: {mapped.complemento}</Text>
      <Text>Dados bancários: {mapped.dados_bancarios}</Text>
      <Text> </Text>
      <Text>CRO: {mapped.cro}</Text>
      <Text>Formação: {labelFormacaoAuxiliar(mapped.formacao)}</Text>
    </View>
  );
};

export const formacaoAuxiliar = ["TSB", "ASB", "ETSB", "EASB"];

export const labelFormacaoAuxiliar = (abrev) => {
  const label = [
    "Técnica em Saúde Bucal",
    "Auxiliar de Saúde Bucal",
    "Estagiário(a) de TSB",
    "Estagiário(a) de ASB",
  ];
  const i = formacaoAuxiliar.indexOf(abrev);
  return i < 0 ? "Not found" : label[i];
};

export const mapProcedimentoFormToRequest = (formData, idProcedimento, idAdmin) => {
  let val = formData;
  let data = {
    admin: idAdmin,
    id: idProcedimento,
    nome: val.nome,
    duracao: val.duracao,
    dm_tipo: val.tipo,
  };
  return data;
};

export const mapProcedimentoResponseToForm = (data) => {
  if (!data) {
    return undefined;
  }
  let d = data.procedimento;
  let auxiliar = {
    id: d.id,
    nome: d.nome,
    duracao: d.duracao,
    tipo: d.dm_tipo,
  };
  return auxiliar;
};

export const mapProcedimentoToExcel = (data) => {
  let d = data;
  return {
    id: d.id,
    nome: d.nome,
    duracao: d.duracao + " min",
    exige_encaminhamento: d.dm_tipo === "restrito" ? "SIM" : "NÃO",
  };
};

export const mapPacienteFormToRequest = (formData, idPaciente) => {
  let val = formData;
  let pess = {
    id: idPaciente,
    nome: val.nome,
    nr_cpf: val.cpf.replace(/(\D)/g, ""),
    dt_nascimento: val.nascimento,
    email: val.email,
    nr_tel: val.tel1,
  };
  let data = {
    id: idPaciente,
    pessoa: pess,
  };
  return data;
};

export const mapPacienteResponseToForm = (data) => {
  if (!data) {
    return undefined;
  }
  let d = data;
  let paciente = {
    id: d.id,
    nome: d.Pessoa.nome,
    cpf: formatar("0000000000" + d.Pessoa.nr_cpf, "cpf"),
    nascimento: formatar(d.Pessoa.dt_nascimento, "dt"),
    email: d.Pessoa.email,
    tel1: formatar(d.Pessoa.nr_tel, "cell"),
  };
  return paciente;
};

export const mapAtendimentoToExcel = (data) => {
  let d = data;
  return {
    x: "x",
  };
};

export const mapAtendimentoFormToRequest = (formData, idAtendimento, idUser) => {
  console.log(formData.vaga);
  return {
    id: idAtendimento,
    user: idUser,
    dm_situacao: formData.situacao,
    dm_convenio: formData.convenio,
    id_paciente: formData.paciente.id,
    id_dentista: formData.vaga.dentista_id,
    id_procedimento: formData.procedimento.id,
    dt_horario: formData.vaga.horario,
  };
};

export const mapAtendimentoResponseToForm = (data) => {
  if (!data) {
    return undefined;
  }
  return {
    idAtendimento: data.id,
    situacao: data.dm_situacao,
    convenio: data.dm_convenio,
    paciente: data.id_paciente,
    dentista: data.id_dentista,
    procedimento: data.id_procedimento,
    vaga: data.dt_horario,
  };
};
