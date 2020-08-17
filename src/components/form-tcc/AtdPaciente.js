import React from "react";
import { Field, reduxForm } from "redux-form";
import validate from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const AtdPaciente = (props) => {
  const { onCancel, reset, handleSubmit } = props;

  React.useEffect(() => {
    if (!props.pessoa) {
      return;
    }
    props.change("email", props.pessoa.email);
  }, [props.pessoa]);

  const off = props.readOnly ? "-" : "";

  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" type={"text-email" + off} component={renderField} label="Email" />
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
  form: "wizard_atd", //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
  enableReinitialize: true,
})(AtdPaciente);
