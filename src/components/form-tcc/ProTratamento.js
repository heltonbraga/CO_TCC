import React from "react";
import { Field, reduxForm } from "redux-form";
import { validate } from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const ProTratamento = (props) => {
  const { onCancel, reset, handleSubmit } = props;

  React.useEffect(() => {
    if (!props.paciente) {
      return;
    }
    props.change("plano", props.paciente.plano_tratamento);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.paciente]);

  const off = props.readOnly ? "-" : "";

  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="plano"
        type={"textarea-" + off}
        component={renderField}
        label="Plano de tratamento"
      />
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
  form: "wizard_pront",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
})(ProTratamento);
