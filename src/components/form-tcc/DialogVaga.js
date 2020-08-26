import React from "react";
import moment from "moment";
import { getVagasCalendario } from "../Api";
import {
  CircularProgress,
  Dialog,
  Grid,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Alert } from "reactstrap";

const semana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default class DialogVaga extends React.Component {
  state = {
    sub: false,
    wait: true,
    opcoes: [],
    vagas: [],
    calendario: [],
    expanded: "",
  };

  componentDidMount() {
    getVagasCalendario(
      this.props.dentista,
      this.props.procedimento,
      this.props.token,
      this.loadVagas,
      this.showError
    );
  }

  loadVagas = (data) => {
    let calendario = [];
    const diasComVaga = data.data.map((v) => v.dia).sort((a, b) => new Date(a) - new Date(b));
    const first = moment(diasComVaga[0]).day(0);
    const last = diasComVaga[diasComVaga.length - 1];
    let day = first;
    while (moment(day).isSameOrBefore(last)) {
      let vaga = data.data.filter((v) => v.dia === day.format("YYYY-MM-DD"));
      if (vaga.length === 0) {
        vaga = [{ dia: day.format("YYYY-MM-DD"), turnos: [false, false, false], horarios: [] }];
      } else {
        let manha = vaga[0].horarios.some((h) => moment(h.horario).hour() < 12);
        let tarde = vaga[0].horarios.some(
          (h) => moment(h.horario).hour() >= 12 && moment(h.horario).hour() < 18
        );
        let noite = vaga[0].horarios.some((h) => moment(h.horario).hour() >= 18);
        vaga[0].turnos = [manha, tarde, noite];
      }
      calendario.push(vaga[0]);
      day = moment(day).add(1, "day");
    }
    this.setState({ vagas: data.data, wait: false, calendario: calendario });
  };

  showError = (err) => {
    this.setState({ wait: false, erro: err });
  };

  selectTurno = (dia, turno) => {
    if (!dia.turnos[turno]) {
      return;
    }
    let opcoes =
      turno === 0
        ? dia.horarios.filter((h) => moment(h.horario).hour() < 12)
        : turno === 1
        ? dia.horarios.filter(
            (h) => moment(h.horario).hour() >= 12 && moment(h.horario).hour() < 18
          )
        : dia.horarios.filter((h) => moment(h.horario).hour() >= 18);
    this.setState({ sub: true, opcoes: opcoes });
  };

  getNome = (id) => {
    let d = this.props.listaDentistas.filter((d) => d.id === parseInt(id))[0];
    return d.Pessoa.nome.split(" ")[0] + "-" + d.nr_cro;
  };

  handleHourPanelChange = (id) => {
    let novo = this.state.expanded === id ? "" : id;
    this.setState({ expanded: novo });
  };

  renderDiaSelecionado = () => {
    const compacto = window.innerWidth <= 500;
    let dia = this.state.opcoes[0];
    return (
      <div className="dayDetail">
        <Typography style={{ textAlign: "center" }} variant="h6" component="div">
          {moment(dia.horario).format("DD/MM/YYYY")}
        </Typography>
        {this.state.opcoes.map((o, i) => (
          <Accordion
            expanded={this.state.expanded === "hp_" + i}
            onChange={(e) => this.handleHourPanelChange("hp_" + i)}
            className="hourPanel"
            key={i}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={"hp_" + i}
              id={"hp_" + i}
            >
              <Typography style={{ textAlign: "center" }} variant="h6" component="div">
                {o.horario.slice(-5)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {o.dentistas.map((id) => (
                <div
                  className="tagDentista"
                  key={id}
                  onClick={(e) => this.props.callback({ opcao: o, dentista: id })}
                >
                  {this.getNome(id)}
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  };

  renderCalendario = () => {
    const compacto = window.innerWidth <= 500;
    let cal = this.state.calendario.slice();
    let semanas = [];
    while (cal.length) {
      semanas.push(cal.splice(0, 7));
    }
    return (
      <Grid container>
        <table id="calendar">
          <thead>
            <tr className="weekdays">
              {semana.map((d) => (
                <th scope="col" className="weekday" key={d}>
                  {compacto ? d.slice(0, 1).toUpperCase() : d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {semanas.map((s, i) => {
              let temNoite = s.filter((d) => d.turnos[2]).length > 0;
              return (
                <tr key={i}>
                  {s.map((d, j) => (
                    <td className={d.horarios.length === 0 ? "dayOff" : "day"} key={j}>
                      <div className="date">{d.dia.slice(-2) + "/" + d.dia.slice(5, 7)}</div>
                      {d.horarios.length > 0 && (
                        <div>
                          <div
                            className={d.turnos[0] ? "turnoComVaga" : "turnoSemVaga"}
                            onClick={(e) => this.selectTurno(d, 0)}
                          >
                            {compacto ? "M" : "manhã"}
                          </div>
                          <div
                            className={d.turnos[1] ? "turnoComVaga" : "turnoSemVaga"}
                            onClick={(e) => this.selectTurno(d, 1)}
                          >
                            {compacto ? "T" : "tarde"}
                          </div>
                          {temNoite && (
                            <div
                              className={d.turnos[2] ? "turnoComVaga" : "turnoSemVaga"}
                              onClick={(e) => this.selectTurno(d, 2)}
                            >
                              {compacto ? "N" : "noite"}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Grid>
    );
  };

  render() {
    return (
      <Dialog open={true} fullScreen={window.innerWidth <= 500}>
        <div className="divCal">
          {this.state.erro && (
            <Alert
              color="warning"
              isOpen={this.state.erro !== null}
              toggle={(e) => this.setState({ erro: null })}
            >
              {this.state.erro}
            </Alert>
          )}
          {this.state.wait && <CircularProgress />}
          <Grid container justify="center">
            {!this.state.sub && <Grid item>{this.renderCalendario()}</Grid>}
            {this.state.sub && <Grid item>{this.renderDiaSelecionado()}</Grid>}
          </Grid>
          <div style={{ marginTop: "30px" }}>
            <Grid container justify="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(e) => {
                    if (this.state.sub) {
                      this.setState({ sub: false });
                    } else {
                      this.props.callback();
                    }
                  }}
                >
                  Voltar
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </Dialog>
    );
  }
}
