import React from "react";
import { Field, reduxForm } from "redux-form";
import MenuItem from "@material-ui/core/MenuItem";
import { validate } from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const alergias = ["nenhuma", "antibióticos", "analgésicos", "ambos", "outros"];

const AnamneseAlergia = (props) => {
  const { onCancel, reset, handleSubmit } = props;

  React.useEffect(() => {
    if (!props.paciente || !props.paciente.Anamnese) {
      return;
    }
    const a = props.paciente.Anamnese;
    props.change("alergia", a.dm_alergia);
    props.change("txtAlergia", a.de_alergia);
    props.change("medicamentos", a.de_medicamento);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.paciente]);

  const off = props.readOnly ? "-" : "";
  
  return (
    <form onSubmit={handleSubmit}>
      <Field name="alergia" type={"combo-" + off} component={renderField} label="Alergias">
        {alergias.map((a) => (
          <MenuItem key={a} value={a}>
            {a}
          </MenuItem>
        ))}
      </Field>
      <Field
        name="txtAlergia"
        type={"text-" + off}
        component={renderField}
        label="Descrição das alergias"
      />
      <Field
        name="medicamentos"
        type={"text-" + off}
        component={renderField}
        label="Medicamentos em uso"
      />
      <WizButtons
        onCancel={(e) => {
          reset();
          onCancel();
        }}
        resto={props}
      />
    </form>
  );
};

export default reduxForm({
  form: "wizard_anam",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
})(AnamneseAlergia);
