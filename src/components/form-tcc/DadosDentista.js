import React from "react";
import { Field, reduxForm } from "redux-form";
import {validate} from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const DadosDentistas = (props) => {
  const { onCancel, reset, handleSubmit } = props;

  React.useEffect(() => {
    if (!props.dentista) {
      return;
    }
    props.change("cro", props.dentista.cro);
    props.change("liberacao", props.dentista.liberacao);
    props.change("bloqueio", props.dentista.bloqueio);
  }, [props.dentista]);

  const off = props.readOnly ? "-" : "";

  return (
    <form onSubmit={handleSubmit}>
      <Field name="cro" type={"text-num" + off} component={renderField} label="CRO" />
      <Field
        name="liberacao"
        type={"date-" + off}
        component={renderField}
        label="Data de liberação"
      />
      <Field
        name="bloqueio"
        type={"date-" + off}
        component={renderField}
        label="Data de bloqueio"
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
  form: "wizard", //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
  enableReinitialize: true,
})(DadosDentistas);
