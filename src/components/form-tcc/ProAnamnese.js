import React from "react";
import { reduxForm } from "redux-form";
import { validate } from "./validate";
import WizButtons from "./WizButtons";
import { Button } from "@material-ui/core";

const ProAnamnese = (props) => {
  const { onCancel, reset, handleSubmit } = props;
  let idAnamnese =
    props.paciente && props.paciente.anamnese ? props.paciente.anamnese.id : props.idAnamnese;

  React.useEffect(() => {
    if (props.paciente && props.paciente.anamnese && !props.idAnamnese) {
      props.change("idAnamnese", props.paciente.anamnese.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.paciente]);

  const renderParteAnamnese = (sessao, info, complemento) => {
    return (
      <span>
        <b>{sessao}:</b> {info ? info : "- "} {complemento ? ", " + complemento : ""}
      </span>
    );
  };

  const renderAnamnese = () => {
    if (!props.paciente || !props.paciente.anamnese) {
      return "";
    }
    const a = props.paciente.anamnese;
    let alergia = a.dm_alergia === "ambos" ? "antibióticos e analgésicos" : a.dm_alergia;
    return (
      <span>
        {renderParteAnamnese("Alergia", alergia, a.de_alergia)}
        <br />
        {renderParteAnamnese("Pressão arterial", a.dm_pressao)}
        <br />
        {renderParteAnamnese("Tipo sanguíneo", a.dm_sangue)}
        <br />
        {renderParteAnamnese("Medicamentos em uso", a.de_medicamentos)}
        <br />
        {renderParteAnamnese("Observações", a.observacao)}
        <br />
      </span>
    );
  };

  const handleAnamnese = () => {
    props.setTela("EDIT_ANAMNESE:" + props.paciente.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <b>Anamnese: </b>
        <br />
        {renderAnamnese()}
      </p>
      <div style={{ marginTop: "30px" }}>
        {!props.readOnly && (
          <Button variant="contained" color="primary" onClick={handleAnamnese}>
            {!idAnamnese ? "Responder" : "Atualizar"}
          </Button>
        )}
      </div>
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
})(ProAnamnese);
