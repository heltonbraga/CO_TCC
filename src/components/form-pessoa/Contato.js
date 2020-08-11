import React from "react";
import { Field, reduxForm } from "redux-form";
import validate from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const Contato = (props) => {
  const { onCancel, reset, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" type="text-email" component={renderField} label="Email" />
      <Field name="tel1" type="text-cell" component={renderField} label="Celular" />
      <Field name="tel2" type="text-fixo" component={renderField} label="Fixo" />
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
})(Contato);
