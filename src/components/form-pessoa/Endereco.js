import React from "react";
import { Field, reduxForm } from "redux-form";
import validate from "./validate";
import WizButtons from "./WizButtons";
import renderField from "./renderField";

const buscarPeloCep = (e, props) => {
  const cep = e.target.value;
  if (cep && cep.length === 10) {
    let key = cep.replace(".", "").replace("-", "");
    fetch("https://api.pagar.me/1/zipcodes/" + key, { method: "get" })
      .then((response) => response.json())
      .then((obj) => preencherPeloCep(obj, props));
  }
};

const preencherPeloCep = ({ street, neighborhood, city, state }, props) => {
  props.change("estado", state);
  props.change("cidade", city);
  props.change("endereco", street + ", " + neighborhood);
};

const Endereco = (props) => {
  const { onCancel, reset, handleSubmit } = props;

  React.useEffect(() => {
    if (!props.pessoa) {
      return;
    }
    props.change("cep", props.pessoa.cep);
    props.change("estado", props.pessoa.estado);
    props.change("cidade", props.pessoa.cidade);
    props.change("endereco", props.pessoa.endereco);
    props.change("complemento", props.pessoa.complemento);
  }, [props.pessoa]);

  const off = props.readOnly ? "-" : "";

  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="cep"
        type={"text-cep" + off}
        component={renderField}
        label="CEP"
        onChange={(e) => buscarPeloCep(e, props)}
      />
      <Field name="estado" type={"text-:2" + off} component={renderField} label="Estado (sigla)" />
      <Field name="cidade" type={"text-" + off} component={renderField} label="Cidade" />
      <Field name="endereco" type={"text-" + off} component={renderField} label="Endereço" />
      <Field name="complemento" type={"text-" + off} component={renderField} label="Complemento" />
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
})(Endereco);
