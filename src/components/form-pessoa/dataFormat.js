export const formatar = (value, format) => {
  if (!value) return undefined;
  let val = value;
  if (format.slice(0, 1) === ":") {
    val = val.slice(-1 * parseInt(format.slice(1)));
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
