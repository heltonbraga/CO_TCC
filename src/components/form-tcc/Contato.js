import React from "react";
import { Field, reduxForm } from "redux-form";
import {validate} from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const Contato = (props) => {
  const { onCancel, reset, handleSubmit } = props;

  React.useEffect(() => {
    if (!props.pessoa) {
      return;
    }
    props.change("email", props.pessoa.email);
    props.change("tel1", props.pessoa.tel1);
    props.change("tel2", props.pessoa.tel2);
  }, [props.pessoa]);

  const off = props.readOnly ? "-" : "";

  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" type={"text-email" + off} component={renderField} label="Email" />
      <Field name="tel1" type={"text-cell" + off} component={renderField} label="Celular" />
      <Field name="tel2" type={"text-fixo" + off} component={renderField} label="Fixo" />
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
})(Contato);
