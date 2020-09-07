import React from "react";
import { Field, reduxForm } from "redux-form";
import MenuItem from "@material-ui/core/MenuItem";
import {validate} from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const Identificacao = (props) => {
  const { onCancel, reset, handleSubmit } = props;

  React.useEffect(() => {
    if (!props.pessoa) {
      return;
    }
    props.change("nome", props.pessoa.nome);
    props.change("cpf", props.pessoa.cpf);
    props.change("nascimento", props.pessoa.nascimento);
    props.change("sexo", props.pessoa.sexo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pessoa]);

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
      <Field name="sexo" type={"combo-" + off} component={renderField} label="Sexo">
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
  enableReinitialize: true,
})(Identificacao);
