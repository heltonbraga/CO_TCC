import React from "react";
import { Field, reduxForm } from "redux-form";
import MenuItem from "@material-ui/core/MenuItem";
import validate from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const Identificacao = (props) => {
  const { onCancel, reset, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field name="nome" type="text" component={renderField} label="Nome" />
      <Field name="cpf" type="text-cpf" component={renderField} label="CPF" />
      <Field name="nascimento" type="date" component={renderField} label="Data de Nascimento" />
      <Field name="sexo" type="combo" component={renderField} label="Sexo">
        <MenuItem value="M">Masculino</MenuItem>
        <MenuItem value="F">Feminino</MenuItem>
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
})(Identificacao);
