import React from "react";
import { Field, reduxForm } from "redux-form";
import {validate} from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const Paciente = (props) => {
  const { onCancel, reset, handleSubmit } = props;

  React.useEffect(() => {
    if (!props.paciente) {
      return;
    }
    props.change("nome", props.paciente.nome);
    props.change("cpf", props.paciente.cpf);
    props.change("nascimento", props.paciente.nascimento);
    props.change("email", props.paciente.email);
    props.change("tel1", props.paciente.tel1);
  }, [props.paciente]);

  const off = props.readOnly ? "-" : "";

  return (
    <form onSubmit={handleSubmit}>
      <Field name="nome" type={"text-" + off} component={renderField} label="Nome" />
      <Field name="cpf" type={"text-cpf" + off} component={renderField} label="CPF" />
      <Field
        name="nascimento"
        type={"date-" + off}
        component={renderField}
        label="Data de Nascimento"
      />
      <Field name="email" type={"text-email" + off} component={renderField} label="Email" />
      <Field name="tel1" type={"text-cell" + off} component={renderField} label="Celular" />
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
  form: "cad_pac", 
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
})(Paciente);
