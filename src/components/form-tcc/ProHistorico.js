import React from "react";
import { reduxForm } from "redux-form";
import { validate } from "./validate";
import WizButtons from "./WizButtons";
import {
  List,
  ListItem,
  ListSubheader,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  ListItemText,
  Divider,
} from "@material-ui/core";
import moment from "moment";
import HDialog from "../HDataTable/HDialog";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const ProHistorico = (props) => {
  const { onCancel, reset, handleSubmit } = props;
  const [lista, setLista] = React.useState([]);
  const [showSub, setShowSub] = React.useState(false);
  const [anotacao, setAnotacao] = React.useState("");
  const [expanded, setExpanded] = React.useState("");
  const [descExame1, setDescExame1] = React.useState("");
  const [urlsExame1, setUrlsExame1] = React.useState("");
  const [descExame2, setDescExame2] = React.useState("");
  const [urlsExame2, setUrlsExame2] = React.useState("");
  const [descExame3, setDescExame3] = React.useState("");
  const [urlsExame3, setUrlsExame3] = React.useState("");

  const updateDescExame = (val, i) => {
    if (i === 1) {
      setDescExame1(val);
    }
    if (i === 2) {
      setDescExame2(val);
    }
    if (i === 3) {
      setDescExame3(val);
    }
  };

  const updateUrlsExame = (val, i) => {
    if (i === 1) {
      setUrlsExame1(val);
    }
    if (i === 2) {
      setUrlsExame2(val);
    }
    if (i === 3) {
      setUrlsExame3(val);
    }
  };

  const renderDivExame = (i) => {
    const desc = [null, descExame1, descExame2, descExame3];
    const urls = [null, urlsExame1, urlsExame2, urlsExame3];
    return (
      <div>
        <TextField
          label={"Descrição do exame " + i}
          placeholder={"Descrição do exame " + i}
          className="FormTextField"
          value={desc[i]}
          onChange={(e) => updateDescExame(e.target.value, i)}
        />
        <TextField
          label={"Link para o exame " + i}
          placeholder={"Link para o exame " + i}
          className="FormTextField"
          value={urls[i]}
          onChange={(e) => updateUrlsExame(e.target.value, i)}
        />
      </div>
    );
  };

  const renderDialog = () => {
    return (
      <div>
        <div className="WizForm">
          <TextField
            multiline
            rows={4}
            label="Anotações"
            variant="outlined"
            className="FormTextField"
            value={anotacao}
            onChange={(e) => setAnotacao(e.target.value)}
          />
        </div>
        <div>
          <span>Exames apresentados:</span>
          <div>
            {[0, 1, 2, 3].map((p, i) => {
              return i === 0 ? (
                ""
              ) : (
                <Accordion
                  expanded={expanded === "hp_" + i}
                  onChange={(e) => setExpanded(expanded === "hp_" + i ? "" : "hp_" + i)}
                  className="hourPanel"
                  key={i}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={"hp_" + i}
                    id={"hp_" + i}
                  >
                    <Typography style={{ textAlign: "center" }} variant="h6" component="div">
                      Exame {i}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>{renderDivExame(i)}</AccordionDetails>
                </Accordion>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const clearDialog = () => {
    setExpanded("");
    setDescExame1("");
    setDescExame2("");
    setDescExame3("");
    setUrlsExame1("");
    setUrlsExame2("");
    setUrlsExame3("");
    setAnotacao("");
  };

  const handleInclusao = () => {
    let exames = [];
    if (descExame1 && urlsExame1) {
      exames.push({ descricao: descExame1, url: urlsExame1 });
    }
    if (descExame2 && urlsExame2) {
      exames.push({ descricao: descExame2, url: urlsExame2 });
    }
    if (descExame1 && urlsExame3) {
      exames.push({ descricao: descExame3, url: urlsExame3 });
    }
    let reg = {
      dt_horario: moment().format("YYYY-MM-DD HH:mm:ss"),
      anotacao: anotacao,
      dentista_id: props.perfil.id,
      paciente_id: props.paciente.id,
      Exames: exames,
    };
    let arr = lista;
    arr.push(reg);
    setLista(arr);
    props.change("novosProntuarios", arr);
    setShowSub(false);
    clearDialog();
  };

  const getNomeDentista = (id) => {
    let filtered = props.dentistas.filter((d) => d.id === id);
    return filtered && filtered.length > 0 ? filtered[0].Pessoa.nome : id;
  };

  return (
    <form onSubmit={handleSubmit}>
      {!props.readOnly && (
        <Button variant="contained" color="primary" onClick={(e) => setShowSub(true)}>
          Registro de atendimento
        </Button>
      )}
      <div className="divHist">
        <List
          subheader={<ListSubheader component="div">Histórico</ListSubheader>}
          className="listProntuario"
        >
          {lista.concat(props.paciente.prontuarios).map((p, i) => {
            return (
              <span key={i}>
                <ListItem key={i}>
                  <ListItemText
                    primary={
                      moment(p.dt_horario).format("DD/MM/YYYY HH:mm") +
                      "h - Dr(a) " +
                      getNomeDentista(p.dentista_id)
                    }
                    secondary={
                      <React.Fragment>
                        <span>{p.anotacao}</span>
                        <br />
                        {p.Exames &&
                          p.Exames.map((exame, i) => (
                            <a target="blank" href={exame.url} key={i}>
                              {" [" + exame.descricao + "] "}
                            </a>
                          ))}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" key={"separador" + i} />
              </span>
            );
          })}
        </List>
      </div>
      {showSub && (
        <HDialog
          title="Inclusão de registro de atendimento"
          contentRender={renderDialog}
          open={showSub}
          onClose={(e) => setShowSub(false)}
          onPrimary={handleInclusao}
          primaryLabel="Gravar"
          onSecondary={(e) => setShowSub(false)}
          secondaryLabel="Cancelar"
        />
      )}
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
})(ProHistorico);
