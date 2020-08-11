import React from "react";
import { change, reduxForm, Field } from "redux-form";
import {
  MenuItem,
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
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import validate from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const ProcDispDentista = (props) => {
  const { onCancel, reset, handleSubmit } = props;
  const semana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  let horas = [];
  for (let i = 6; i <= 22; i++) {
    let str = ("0" + i).slice(-2);
    horas.push(str + ":00");
    horas.push(str + ":30");
  }

  const [habilitados, setHabilitados] = React.useState([]);
  const [horarios, setHorarios] = React.useState([]);
  const [dia, setDia] = React.useState(semana[1]);
  const [inicio, setInicio] = React.useState("08:00");
  const [fim, setFim] = React.useState("18:00");
  const [erroDia, setErroDia] = React.useState();
  const [erroHora, setErroHora] = React.useState();

  const handleChange = (event, props) => {
    setHabilitados(event.target.value);
  };

  const handleMarcarTodos = (event, props) => {
    let marcados = [];
    if (event.target.checked) {
      marcados = props.procedimentos.map((p) => p.nome);
    }
    setHabilitados(marcados);
  };

  const renderTelaProc = () => {
    return (
      <FormControl className="WizFormControl">
        <InputLabel htmlFor="multiSelectProcedimentos">Procedimentos</InputLabel>
        <Select
          id="multiSelectProcedimentos"
          multiple
          value={habilitados}
          onChange={(e) => handleChange(e, props)}
          input={<Input />}
          renderValue={(selected) => selected.join(", ")}
          className="MultSelect"
          MenuProps={{
            getContentAnchorEl: () => null,
          }}
        >
          {props.procedimentos.map((p) => (
            <MenuItem key={p.nome} value={p.nome}>
              <Checkbox checked={habilitados.indexOf(p.nome) > -1} />
              <ListItemText primary={p.nome} />
            </MenuItem>
          ))}
        </Select>
        <FormControlLabel
          control={
            <Checkbox
              checked={habilitados.length === props.procedimentos.length}
              onChange={(e) => handleMarcarTodos(e, props)}
              id="ckMarcarTodos"
              name="marcarTodos"
            />
          }
          label={
            habilitados.length === props.procedimentos.length ? "Desmarcar todos" : "Marcar todos"
          }
        />
      </FormControl>
    );
  };

  const addDisp = () => {
    let disp = {
      dia_str: dia,
      dia_num: semana.indexOf(dia),
      inicio_str: inicio,
      inicio_num: parseInt(inicio.split(":").join()),
      fim_str: fim,
      fim_num: parseInt(fim.split(":").join()),
    };
    if (disp.inicio_num >= disp.fim_num) {
      setErroHora("Conflito entre início e fim");
      return;
    }
    let conflito = horarios.filter(
      (d) =>
        d.dia_num === disp.dia_num && d.inicio_num < disp.fim_num && d.fim_num > disp.inicio_num
    );
    if (conflito && conflito.length > 0) {
      setErroDia("Conflito com outra disponibilidade");
      return;
    }
    let novaDisp = horarios;
    novaDisp.push(disp);
    setHorarios(novaDisp);
    setDia(semana[(disp.dia_num + 1) % 7]);
  };

  const delDisp = (event, disp) => {
    let novaDisp = horarios.filter(
      (d) =>
        !(
          d.dia_num === disp.dia_num &&
          d.inicio_num === disp.inicio_num &&
          d.fim_num === disp.fim_num
        )
    );
    setHorarios(novaDisp);
    setDia(semana[disp.dia_num % 7]);
  };

  const renderTelaDisp = () => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify="center">
            <List
              dense
              className="ListaDisp"
              subheader={
                <ListSubheader component="div" id="list-subheader">
                  Disponibilidade
                </ListSubheader>
              }
            >
              {horarios.map((d) => (
                <ListItem key={d.dia_str + d.inicio_str} className="ListaDispItem">
                  <ListItemText
                    className="ListaDispItemText"
                    primary={d.dia_str + " de " + d.inicio_str + " às " + d.fim_str + " "}
                  />
                  <IconButton tooltip="remover" onClick={(e) => delDisp(e, d)}>
                    <DeleteIcon color="secondary" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item>
            <Select
              className="dispSelect"
              error={erroDia && erroDia.length > 0}
              value={dia}
              onChange={(e) => {
                setDia(e.target.value);
                setErroHora();
                setErroDia();
              }}
            >
              {semana.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              className="dispSelect"
              error={erroHora && erroHora.length > 0}
              value={inicio}
              onChange={(e) => {
                setInicio(e.target.value);
                setErroHora();
                setErroDia();
              }}
            >
              {horas.map((h) => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText error>{erroHora}</FormHelperText>
            <FormHelperText error>{erroDia}</FormHelperText>
          </Grid>
          <Grid item>
            <Select
              className="dispSelect"
              error={erroHora && erroHora.length > 0}
              value={fim}
              onChange={(e) => {
                setFim(e.target.value);
                setErroHora();
                setErroDia();
              }}
            >
              {horas.map((h) => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </Select>
            <IconButton
              color="primary"
              aria-label="add disponibilidade"
              component="span"
              onClick={addDisp}
            >
              <AddCircleIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const preSubmit = (e) => {
    e.preventDefault();
    sethiddenProps();
    handleSubmit(e);
  };

  const sethiddenProps = () => {
    props.change(
      "procedimentosHabilitados",
      props.procedimentos.filter((p) => habilitados.indexOf(p.nome) >= 0)
    );
    props.change("horariosDisponiveis", horarios);
    console.log(props);
  };

  return (
    <form onSubmit={preSubmit}>
      {renderTelaProc()}
      {renderTelaDisp()}
      <Field
        name="procedimentosHabilitados"
        type="hidden"
        style={{ height: 0 }}
        component={renderField}
        label="procedimentosHabilitados"
      />
      <Field
        name="horariosDisponiveis"
        type="hidden"
        style={{ height: 0 }}
        component={renderField}
        label="horariosDisponiveis"
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
})(ProcDispDentista);
