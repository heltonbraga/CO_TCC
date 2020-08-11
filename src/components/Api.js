import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

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
      (err) => onError(err)
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
      (err) => onError(err)
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
  return perfil;
};

export const getBancos = (onSuccess, onError) => {
  axios
    .get("bancos")
    .then(
      (res) => onSuccess(res),
      (err) => onError(err)
    );
};

export const getProcedimentos = (onSuccess, onError) => {
  axios
    .get("procedimentos")
    .then(
      (res) => onSuccess(res),
      (err) => onError(err)
    );
};
