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

export const getAllDentistas = (page, pageSize, order, token, onSuccess, onError) => {
  axios
    .get("dentistas", {
      params: {
        page: page,
        pagesize: pageSize,
        order: order,
      },
      headers: { Authorization: "Bearer: " + token },
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
      headers: { Authorization: "Bearer: " + token },
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
      headers: { Authorization: "Bearer: " + token },
    })
    .then(
      (res) => onSuccess(res),
      (err) => onError(digerirErro(err))
    );
};

export const getPerfil = (user) => {
  //TODO / temporariamente mocked
  let perfil = "paciente";
  if (user && user.sub) {
    if (user.sub.indexOf("github") >= 0) {
      perfil = "administrador";
    } else if (user.sub.indexOf("google") >= 0) {
      perfil = "dentista";
    } else if (user.sub.indexOf("face") >= 0) {
      perfil = "auxiliar";
    }
  }
  return { perfil: perfil, id: 1 };
};

export const getBancos = (onSuccess, onError) => {
  axios.get("bancos").then(
    (res) => onSuccess(res),
    (err) => onError(digerirErro(err))
  );
};

export const getProcedimentos = (onSuccess, onError) => {
  axios.get("procedimentos").then(
    (res) => onSuccess(res),
    (err) => onError(digerirErro(err))
  );
};

export const createDentista = (data, token, onSuccess, onError, extra) => {
  axios
    .post("dentistas", data, {
      headers: { Authorization: "Bearer: " + token },
    })
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};

export const updateDentista = (data, token, onSuccess, onError, extra) => {
  axios
    .patch("dentistas", data, {
      headers: { Authorization: "Bearer: " + token },
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
        headers: { Authorization: "Bearer: " + token },
      }
    )
    .then(
      (res) => onSuccess(res, extra),
      (err) => onError(digerirErro(err))
    );
};
