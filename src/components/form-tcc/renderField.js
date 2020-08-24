import React from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { formatar } from "./dataFormat";

const aplicarMascara = (e, mask) => {
  if (!mask) {
    return;
  }
  e.target.value = formatar(e.target.value, mask);
};

const renderTextField = ({ input, label, touched, invalid, error, mask, readOnly }) => {
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
        disabled={readOnly}
        {...input}
      />
    </div>
  );
};

const renderSelectField = ({ input, label, touched, error, children, readOnly }) => {
  return (
    <div className="WizForm">
      <FormControl className="WizFormControl">
        <InputLabel htmlFor={label}>{label}</InputLabel>
        <Select
          id={label}
          error={touched && error && error.length > 0}
          {...input}
          children={children}
          className="FormTextField"
          disabled={readOnly}
        />
      </FormControl>
    </div>
  );
};

const renderDateField = ({ input, label, touched, invalid, error, readOnly }) => {
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
        disabled={readOnly}
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
  let readOnly = arType.length > 2;
  if (arType[0] === "text") {
    return renderTextField({ input, label, touched, invalid, error, mask, readOnly });
  }
  if (arType[0] === "combo") {
    return renderSelectField({ input, label, touched, error, children, readOnly });
  }
  if (arType[0] === "date") {
    return renderDateField({ input, label, touched, invalid, error, readOnly });
  }
  return (
    <div>
      <input {...input} placeholder={label} type={type} disabled={true} />
    </div>
  );
};

export default renderField;
