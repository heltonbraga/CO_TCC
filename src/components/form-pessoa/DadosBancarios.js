import React from "react";
import { Field, reduxForm } from "redux-form";
import MenuItem from "@material-ui/core/MenuItem";
import validate from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const DadosBancarios = (props) => {
  const { onCancel, reset, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field name="banco" type="combo" component={renderField} label="Banco">
        {props.bancos.map((bank) => (
          <MenuItem key={bank.codigo} value={bank.codigo}>{bank.nome}</MenuItem>
        ))}
      </Field>
      <Field name="agencia" type="text-agencia" component={renderField} label="Agência" />
      <Field name="conta" type="text-agencia" component={renderField} label="Conta" />
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
})(DadosBancarios);
