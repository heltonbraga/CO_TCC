import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

const digerirErro = (erro) => {
  if (!erro || !erro.response || !erro.response.headers || !erro.response.headers["content-type"]) {
    return "" + erro;
  }
  return erro.response.headers["content-type"].slice(0, 4) === "text"
    ? erro.response.status
    : erro.response.data.message;
};

export const getPerfil = (user, onSuccess) => {
  axios
    .get("usuarios/", {
      params: {
        email: user.email,
      },
    })
    .then(
      (res) => onSuccess(res.data),
      (err) => onSuccess({ id: 0, perfil: "paciente", email: user.email })
    );
};

export const verificarUsuario = (code, tel, token, onSuccess, onError) => {
  getRequest("usuarios/verificar", { code: code, tel: tel }, token, onSuccess, onError);
};

export const getBancos = (onSuccess, onError) => {
  axios.get("bancos").then(
    (res) => onSuccess(res),
    (err) => onError(digerirErro(err))
  );
};

export const getProcedimentos = (onSuccess, onError) => {
  axios.get("proc").then(
    (res) => onSuccess(res),
    (err) => onError(digerirErro(err))
  );
};

export const getProcedimentosLivres = (onSuccess, onError) => {
  axios.get("proc/livres").then(
    (res) => onSuccess(res),
    (err) => onError(digerirErro(err))
  );
};

export const getAllDentistas = (page, pageSize, order, token, onSuccess, onError, admin) => {
  getRequest(
    "dentistas",
    { page: page, pagesize: pageSize, order: order, admin: admin },
    token,
    onSuccess,
    onError
  );
};

export const getDentistasByNome = (nome, token, onSuccess, onError) => {
  getRequest("dentistas/nome", { nome: nome }, token, onSuccess, onError);
};

export const getDentista = (id, admin, token, onSuccess, onError) => {
  getRequest("dentistas", { admin: admin }, token, onSuccess, onError, id);
};

export const createDentista = (data, token, onSuccess, onError, extra) => {
  postRequest("dentistas", data, token, onSuccess, onError, extra);
};

export const updateDentista = (data, token, onSuccess, onError, extra) => {
  patchRequest("dentistas", data, token, onSuccess, onError, extra);
};

export const deleteDentista = (data, token, onSuccess, onError, extra) => {
  axios
    .delete("dentistas", {
      headers: { Authorization: "Bearer " + token },
      data: data,
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const getAllAuxiliares = (page, pageSize, order, token, onSuccess, onError, admin) => {
  getRequest(
    "auxiliares",
    { page: page, pagesize: pageSize, order: order, admin: admin },
    token,
    onSuccess,
    onError
  );
};

export const getAuxiliaresByNome = (nome, token, onSuccess, onError) => {
  getRequest("auxiliares/nome", { nome: nome }, token, onSuccess, onError);
};

export const getAuxiliar = (id, admin, token, onSuccess, onError) => {
  getRequest("auxiliares", { admin: admin }, token, onSuccess, onError, id);
};

export const createAuxiliar = (data, token, onSuccess, onError, extra) => {
  postRequest("auxiliares", data, token, onSuccess, onError, extra);
};

export const updateAuxiliar = (data, token, onSuccess, onError, extra) => {
  patchRequest("auxiliares", data, token, onSuccess, onError, extra);
};

export const deleteAuxiliar = (data, token, onSuccess, onError, extra) => {
  axios
    .delete("auxiliares", {
      headers: { Authorization: "Bearer " + token },
      data: data,
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const getAllProcedimentos = (page, pageSize, order, token, onSuccess, onError, admin) => {
  getRequest(
    "procedimentos",
    { page: page, pagesize: pageSize, order: order, admin: admin },
    token,
    onSuccess,
    onError
  );
};

export const getProcedimentosByNome = (nome, token, onSuccess, onError) => {
  getRequest("procedimentos/nome", { nome: nome }, token, onSuccess, onError);
};

export const getProcedimento = (id, admin, token, onSuccess, onError) => {
  getRequest("procedimentos", { admin: admin }, token, onSuccess, onError, id);
};

export const createProcedimento = (data, token, onSuccess, onError, extra) => {
  postRequest("procedimentos", data, token, onSuccess, onError, extra);
};

export const updateProcedimento = (data, token, onSuccess, onError, extra) => {
  patchRequest("procedimentos", data, token, onSuccess, onError, extra);
};

export const deleteProcedimento = (data, token, onSuccess, onError, extra) => {
  axios
    .delete("procedimentos", {
      headers: { Authorization: "Bearer " + token },
      data: data,
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const getAllPacientes = (page, pageSize, order, token, onSuccess, onError, admin) => {
  getRequest(
    "pacientes",
    { page: page, pagesize: pageSize, order: order, admin: admin },
    token,
    onSuccess,
    onError
  );
};

export const getPacientesByNome = (nome, token, onSuccess, onError) => {
  getRequest("pacientes/nome", { nome: nome }, token, onSuccess, onError);
};

export const getPaciente = (id, user, token, onSuccess, onError) => {
  getRequest("pacientes", {}, token, onSuccess, onError, id);
};

export const createPaciente = (data, token, onSuccess, onError, extra) => {
  postRequest("pacientes", data, token, onSuccess, onError, extra);
};

export const updatePaciente = (data, token, onSuccess, onError, extra) => {
  patchRequest("pacientes", data, token, onSuccess, onError, extra);
};

export const deletePaciente = (data, token, onSuccess, onError, extra) => {
  axios
    .delete("pacientes", {
      headers: { Authorization: "Bearer " + token },
      data: data,
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const getVagas = (dentista, procedimento, dia, extremos, token, onSuccess, onError) => {
  getRequest(
    "vagas",
    { dentista: dentista, procedimento: procedimento, dia: dia, extremos: extremos },
    token,
    onSuccess,
    onError
  );
};

export const getVagasCalendario = (dentista, procedimento, token, onSuccess, onError) => {
  getRequest(
    "vagas/calendario",
    { dentista: dentista, procedimento: procedimento },
    token,
    onSuccess,
    onError
  );
};

export const getAtendimentos = (admin, dentista, dia, token, onSuccess, onError) => {
  getRequest(
    "atendimentos",
    { user: admin, dentista: dentista, dia: dia },
    token,
    onSuccess,
    onError
  );
};

export const getAtendimentosMes = (dia, dentista, token, onSuccess, onError) => {
  getRequest(
    "atendimentos/mes",
    {
      dia: dia,
      dentista: dentista,
    },
    token,
    onSuccess,
    onError
  );
};

export const getAtendimento = (id, user, token, onSuccess, onError) => {
  getRequest("atendimentos", { user: user }, token, onSuccess, onError, id);
};

export const getLogAtendimento = (id, user, token, onSuccess, onError) => {
  getRequest("atendimentos/log", { user: user }, token, onSuccess, onError, id);
};

export const marcarAtendimento = (data, token, onSuccess, onError, extra) => {
  postRequest("atendimentos", data, token, onSuccess, onError, extra);
};

export const remarcarAtendimento = (data, token, onSuccess, onError, extra) => {
  patchRequest("atendimentos/remarcar", data, token, onSuccess, onError, extra);
};

export const confirmarAtendimento = (data, token, onSuccess, onError, extra) => {
  patchRequest("atendimentos/confirmar", data, token, onSuccess, onError, extra);
};

export const cancelarAtendimento = (data, token, onSuccess, onError, extra) => {
  patchRequest("atendimentos/cancelar", data, token, onSuccess, onError, extra);
};

export const getUltimoEProximoAtd = (id, token, onSuccess, onError) => {
  getRequest("atendimentos/paciente", {}, token, onSuccess, onError, id);
};

export const getProntuario = (id, user, token, onSuccess, onError) => {
  getRequest("prontuarios/paciente", { user: user }, token, onSuccess, onError, id);
};

export const createAnamnese = (data, token, onSuccess, onError, extra) => {
  postRequest("anamneses", data, token, onSuccess, onError, extra);
};

export const updateAnamnese = (data, token, onSuccess, onError, extra) => {
  patchRequest("anamneses", data, token, onSuccess, onError, extra);
};

export const updateProtuario = (data, token, onSuccess, onError) => {
  const updPlano = axios.patch(
    "pacientes",
    { id: data.paciente.id, plano_tratamento: data.paciente.plano_tratamento, user: data.user },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
  const newPront = data.prontuarios.map((pront) =>
    axios.post(
      "prontuarios",
      { prontuario: pront, user: data.user },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
  );
  const updAtd = axios.patch(
      "atendimentos/realizar",
      { id: data.atendimento, user: data.user },
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
  axios
    .all([updPlano, updAtd, ...newPront])
    .then((res) => onSuccess(res))
    .catch((err) => onError(digerirErro(err)));
};

const patchRequest = (path, data, token, onSuccess, onError, extra = null) => {
  axios
    .patch(path, data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

const postRequest = (path, data, token, onSuccess, onError, extra = null) => {
  axios
    .post(path, data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

const getRequest = (path, data, token, onSuccess, onError, id = null) => {
  axios
    .get(path + (id ? "/" + id : ""), {
      params: data,
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};
