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
      (err) => onSuccess({ id: 0, perfil: "paciente" })
    );
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

export const getAllDentistas = (page, pageSize, order, token, onSuccess, onError, admin) => {
  axios
    .get("dentistas", {
      params: {
        page: page,
        pagesize: pageSize,
        order: order,
        admin: admin,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const getDentistasByNome = (nome, token, onSuccess, onError) => {
  axios
    .get("dentistas/nome", {
      params: {
        nome: nome,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const getDentista = (id, admin, token, onSuccess, onError) => {
  axios
    .get("dentistas/" + id, {
      params: {
        admin: admin,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const createDentista = (data, token, onSuccess, onError, extra) => {
  axios
    .post("dentistas", data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const updateDentista = (data, token, onSuccess, onError, extra) => {
  axios
    .patch("dentistas", data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const deleteDentista = (data, token, onSuccess, onError, extra) => {
  axios
    .delete(
      "dentistas",
      { data: data },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const getAllAuxiliares = (page, pageSize, order, token, onSuccess, onError, admin) => {
  axios
    .get("auxiliares", {
      params: {
        page: page,
        pagesize: pageSize,
        order: order,
        admin: admin,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const getAuxiliaresByNome = (nome, token, onSuccess, onError) => {
  axios
    .get("auxiliares/nome", {
      params: {
        nome: nome,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const getAuxiliar = (id, admin, token, onSuccess, onError) => {
  axios
    .get("auxiliares/" + id, {
      params: {
        admin: admin,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const createAuxiliar = (data, token, onSuccess, onError, extra) => {
  axios
    .post("auxiliares", data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const updateAuxiliar = (data, token, onSuccess, onError, extra) => {
  axios
    .patch("auxiliares", data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const deleteAuxiliar = (data, token, onSuccess, onError, extra) => {
  axios
    .delete(
      "auxiliares",
      { data: data },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const getAllProcedimentos = (page, pageSize, order, token, onSuccess, onError, admin) => {
  axios
    .get("procedimentos", {
      params: {
        page: page,
        pagesize: pageSize,
        order: order,
        admin: admin,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const getProcedimentosByNome = (nome, token, onSuccess, onError) => {
  axios
    .get("procedimentos/nome", {
      params: {
        nome: nome,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const getProcedimento = (id, admin, token, onSuccess, onError) => {
  axios
    .get("procedimentos/" + id, {
      params: {
        admin: admin,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const createProcedimento = (data, token, onSuccess, onError, extra) => {
  axios
    .post("procedimentos", data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const updateProcedimento = (data, token, onSuccess, onError, extra) => {
  axios
    .patch("procedimentos", data, {
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const deleteProcedimento = (data, token, onSuccess, onError, extra) => {
  axios
    .delete(
      "procedimentos",
      { data: data },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const getAtendimentos = (admin, dentista, dia, token, onSuccess, onError) => {
  axios
    .get("atendimentos", {
      params: {
        user: admin,
        dentista: dentista,
        dia: dia,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const getAtendimento = (id, user, token, onSuccess, onError) => {
  axios
    .get("atendimentos/" + id, {
      params: {
        user: user,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const marcarAtendimento = (data, token, onSuccess, onError) => {
  axios
    .post("atendimentos/marcar", {
      params: {
        data: data,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const confirmarAtendimento = (id, user, token, onSuccess, onError) => {
  axios
    .patch("atendimentos/confirmar", {
      params: {
        user: user,
        id: id,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const cancelarAtendimento = (id, user, token, onSuccess, onError) => {
  axios
    .patch("atendimentos/cancelar", {
      params: {
        user: user,
        id: id,
      },
      headers: { Authorization: "Bearer " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};
