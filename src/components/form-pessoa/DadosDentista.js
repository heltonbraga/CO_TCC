import React from "react";
import { Field, reduxForm } from "redux-form";
import validate from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const DadosDentistas = (props) => {
  const { onCancel, reset, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field name="cro" type="text-num" component={renderField} label="CRO" />
      <Field name="liberacao" type="date" component={renderField} label="Data de liberação" />
      <Field name="bloqueio" type="date" component={renderField} label="Data de bloqueio" />
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
})(DadosDentistas);
