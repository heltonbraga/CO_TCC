import React from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const aplicarMascara = (e, mask) => {
  if (!mask) {
    return;
  }
  let val = e.target.value;
  if (mask === "num") {
    val = val.replace(/(\D)/g, "");
  }
  if (mask === "cpf") {
    val = val.replace(/(\D)/g, "");
    val = val.slice(-11);
    val = val.replace(/(\d{3})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  if (mask === "cell") {
    val = val.replace(/(\D)/g, "");
    val = val.slice(-11);
    val = val.replace(/(\d{2})(\d)/, "($1) $2");
    val = val.replace(/(\d{5})(\d)/, "$1 $2");
  }
  if (mask === "fixo") {
    val = val.replace(/(\D)/g, "");
    val = val.slice(-10);
    val = val.replace(/(\d{2})(\d)/, "($1) $2");
    val = val.replace(/(\d{4})(\d)/, "$1 $2");
  }
  if (mask === "cep") {
    val = val.replace(/(\D)/g, "");
    val = val.slice(-8);
    val = val.replace(/(\d{2})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d)/, "$1-$2");
  }
  if (mask === "agencia") {
    val = val.replace(/(\D)/g, "");
    val = val.length > 1 ? val.slice(0, val.length - 1) + "-" + val.slice(-1) : val;
  }
  e.target.value = val;
};

const renderTextField = ({ input, label, touched, invalid, error, mask }) => {
  return (
    <div className="WizForm">
      <TextField
        label={label}
        placeholder={label}
        error={touched && invalid}
        helperText={touched && error}
        className="FormTextField"
        onKeyUp={(e) => aplicarMascara(e, mask)}
        onChange={(e) => {
          input.onChange(e);
        }}
        {...input}
      />
    </div>
  );
};

const renderSelectField = ({ input, label, touched, error, children }) => {
  return (
    <FormControl className="WizFormControl">
      <InputLabel htmlFor={label}>{label}</InputLabel>
      <Select
        id={label}
        error={touched && error}
        {...input}
        children={children}
        className="FormTextField"
      />
    </FormControl>
  );
};

const renderDateField = ({ input, label, touched, invalid, error }) => {
  return (
    <div className="WizForm">
      <TextField
        id={label}
        label={label}
        type="date"
        helperText={touched && error}
        className="FormTextField"
        InputLabelProps={{
          shrink: true,
        }}
        {...input}
      />
    </div>
  );
};

const renderField = (
  { input, label, type, meta: { touched, invalid, error }, children, onChange },
  ...custom
) => {
  let arType = type.split("-");
  let mask = arType.length > 1 ? arType[1] : null;
  if (arType[0] === "text") {
    return renderTextField({ input, label, touched, invalid, error, mask, onChange });
  }
  if (arType[0] === "combo") {
    return renderSelectField({ input, label, touched, error, children });
  }
  if (arType[0] === "date") {
    return renderDateField({ input, label, touched, invalid, error });
  }
  return (
    <div>
        <input {...input} placeholder={label} type={type} />
        {/*touched && error && <span>{error}!</span>*/}
    </div>
  );
};

export default renderField;
