import React from "react";
import { Field, reduxForm } from "redux-form";
import validate from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";
import MenuItem from "@material-ui/core/MenuItem";
import { labelFormacaoAuxiliar, formacaoAuxiliar } from "../form-tcc/dataFormat";

const DadosAuxiliar = (props) => {
  const { onCancel, reset, handleSubmit } = props;

  React.useEffect(() => {
    if (!props.auxiliar) {
      return;
    }
    props.change("cro", props.auxiliar.cro);
    props.change("formacao", props.auxiliar.formacao);
  }, [props.auxiliar]);

  const off = props.readOnly ? "-" : "";

  return (
    <form onSubmit={handleSubmit}>
      <Field name="cro" type={"text-num" + off} component={renderField} label="CRO" />
      <Field name="formacao" type={"combo-" + off} component={renderField} label="Formação">
        {formacaoAuxiliar.map((abrev) => (
          <MenuItem key={abrev} value={abrev}>
            {labelFormacaoAuxiliar(abrev)}
          </MenuItem>
        ))}
      </Field>
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
  form: "wizard", //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
  enableReinitialize: true,
})(DadosAuxiliar);
