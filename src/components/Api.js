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
