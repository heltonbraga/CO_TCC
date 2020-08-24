import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import {
  MenuItem,
  TextField,
  Checkbox,
  ListItemText,
  ListItem,
  ListSubheader,
  FormHelperText,
  Select,
  Input,
  InputLabel,
  FormControl,
  FormControlLabel,
  IconButton,
  List,
  Grid,
  Tooltip,
  Button,
} from "@material-ui/core";
import moment from "moment";
import { getVagas } from "../Api";
import { validate } from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";
import DialogVaga from "./DialogVaga";

let AtdVaga = (props) => {
  const { onCancel, reset, handleSubmit } = props;
  const fake = { id: 0, Pessoa: { nome: "Sem preferência" } };
  const off = props.readOnly ? "-" : "";
  const [dia, setDia] = React.useState(moment().format("YYYY-MM-DD"));
  const [dialog, setDialog] = React.useState(false);
  const [vagas, setVagas] = React.useState([]);

  let listaDentistas = props.dentistas ? props.dentistas : [];
  if (listaDentistas.filter((d) => d.id === fake.id).length === 0) {
    listaDentistas.push(fake);
  }

  React.useEffect(() => {
    if (!props.dentista) {
      props.change("dentista", fake);
    }
  }, []);

  React.useEffect(() => {
    reloadVagas();
  }, [props.procedimento, props.dentista]);

  const reloadVagas = (outroDia = dia) => {
    if (props.procedimento) {
      getVagas(
        props.dentista.id,
        props.procedimento.id,
        outroDia,
        true,
        props.token,
        loadVagas,
        erroVagas
      );
      props.onWait(true);
    }
  };

  const loadVagas = (data) => {
    setVagas(data.data.registros);
    props.change("vaga", data.data.quantidade > 0 ? data.data.registros[0] : null);
    if (data.data.quantidade === 0) {
      const nextDay = moment(data.data.parametros.dia).add(1, "day").format("YYYY-MM-DD");
      if (moment(nextDay).diff(moment(), "days") < 7) {
        reloadVagas(nextDay);
      } else {
        erroVagas("Sem vagas para os próximos 7 dias.");
      }
    } else {
      setDia(data.data.parametros.dia);
      props.onWait(false);
    }
  };

  const onDialogResult = (result) => {
    if (result) {
      let id = parseInt(result.dentista);
      let dentista = props.dentistas.filter((d) => d.id === id)[0];
      setDia(result.opcao.horario.slice(0, 10));
      setVagas([
        {
          dentista_id: id,
          nr_cro: dentista.nr_cro,
          nome: dentista.Pessoa.nome,
          procedimento_id: props.procedimento.id,
          horario: result.opcao.horario,
        },
      ]);
      props.change("dentista", dentista);
    }
    setDialog(false);
  };

  const erroVagas = (err) => {
    props.showError(err);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justify="center">
        <Grid container justify="center">
          <Field
            name="procedimento"
            type={"combo-" + off}
            component={renderField}
            label="Procedimento"
          >
            {props.procedimentos &&
              props.procedimentos.map((p) => (
                <MenuItem key={p.id} value={p}>
                  <ListItemText primary={p.nome} />
                </MenuItem>
              ))}
          </Field>
        </Grid>
        <Grid container justify="center">
          <Field name="dentista" type={"combo-" + off} component={renderField} label="Dentista">
            {listaDentistas.map((p) => (
              <MenuItem key={p.id} value={p}>
                <ListItemText primary={p.Pessoa.nome} />
              </MenuItem>
            ))}
          </Field>
        </Grid>
        <Grid container justify="center">
          <div className="WizFormControl">
            <TextField
              id="dia"
              label="Dia"
              type="date"
              className="FormDateField"
              InputLabelProps={{
                shrink: true,
              }}
              value={dia}
              onChange={(e) => {
                if (!moment().isAfter(e.target.value, "day")) {
                  setDia(e.target.value);
                  reloadVagas(e.target.value);
                }
              }}
            />
          </div>
          <Field name="vaga" type={"combo-" + off} component={renderField} label="Horário">
            {vagas.map((v, i) => (
              <MenuItem key={i} value={v}>
                <ListItemText primary={v.horario + " - " + v.nome} />
              </MenuItem>
            ))}
          </Field>
        </Grid>
        <Grid container justify="center">
          <Button
            disabled={!props.procedimento}
            variant="contained"
            color="default"
            onClick={(e) => setDialog(true)}
          >
            Buscar mais horários
          </Button>
          {dialog && (
            <DialogVaga
              callback={onDialogResult}
              dentista={props.dentista.id}
              procedimento={props.procedimento.id}
              token={props.token}
              listaDentistas={listaDentistas}
            />
          )}
        </Grid>
        <Grid container justify="center"></Grid>
        <Grid container justify="center">
          <WizButtons
            onCancel={(e) => {
              reset();
              onCancel();
            }}
            resto={props}
          />
        </Grid>
      </Grid>
    </form>
  );
};

AtdVaga = reduxForm({
  form: "wizard_atd", //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
  enableReinitialize: true,
})(AtdVaga);

const selector = formValueSelector("wizard_atd");
AtdVaga = connect((state) => {
  const dentista = selector(state, "dentista");
  const procedimento = selector(state, "procedimento");
  return {
    dentista,
    procedimento,
  };
})(AtdVaga);

export default AtdVaga;
