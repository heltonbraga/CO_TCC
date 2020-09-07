import React from "react";
import { Field, reduxForm } from "redux-form";
import MenuItem from "@material-ui/core/MenuItem";
import {validate} from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const Procedimento = (props) => {
  const { onCancel, reset, handleSubmit } = props;

  React.useEffect(() => {
    if (!props.procedimento) {
      return;
    }
    props.change("nome", props.procedimento.nome);
    props.change("duracao", props.procedimento.duracao);
    props.change("tipo", props.procedimento.tipo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.procedimento]);

  const off = props.readOnly ? "-" : "";

  return (
    <form onSubmit={handleSubmit}>
      <Field name="nome" type={"text-" + off} component={renderField} label="Nome" />
      <Field name="duracao" type={"combo-" + off} component={renderField} label="Duração estimada">
        <MenuItem value="15">15 minutos</MenuItem>
        <MenuItem value="30">30 minutos</MenuItem>
        <MenuItem value="45">45 minutos</MenuItem>
        <MenuItem value="60">60 minutos</MenuItem>
      </Field>
      <Field
        name="tipo"
        type={"combo-" + off}
        component={renderField}
        label="Exige encaminhamento"
      >
        <MenuItem value="restrito">Sim</MenuItem>
        <MenuItem value="livre">Não</MenuItem>
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
  form: "simples", //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
  enableReinitialize: true,
})(Procedimento);
