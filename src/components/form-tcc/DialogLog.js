import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { getLogAtendimento } from "../Api";
import { formatar } from "./dataFormat";
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

class DialogLog extends React.Component {
  state = {
    wait: true,
    log: [],
    expanded: "",
  };

  componentDidMount() {
    getLogAtendimento(
      this.props.atendimento.idAtendimento,
      this.props.perfil.id,
      this.props.setToken,
      this.loadLog,
      this.showError
    );
  }

  loadLog = (data) => {
    this.setState({ wait: false, log: data.data });
  };

  showError = (err) => {
    this.setState({ wait: false, erro: err });
  };

  render() {
    return (
      <Dialog open={true} fullScreen={window.innerWidth <= 500} onClose={this.props.onClose}>
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
            <div className="dayDetail">
              <Typography style={{ textAlign: "center" }} variant="h6" component="div">
                Log de atendimento
              </Typography>
              {this.state.log.map((o, i) => (
                <Accordion
                  expanded={this.state.expanded === "hp_" + i}
                  onChange={(e) =>
                    this.setState({ expanded: this.state.expanded === "hp_" + i ? "" : "hp_" + i })
                  }
                  className="hourPanel"
                  key={i}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={"hp_" + i}
                    id={"hp_" + i}
                  >
                    <div>
                      {moment(o.dt_acao).format("DD/MM/YYYY HH:mm:ss")} - <b>{o.acao}</b>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <p>
                        {o.Pessoa.nome} ({formatar("000000" + o.Pessoa.nr_cpf, "cpf")})
                      </p>
                      {o.complemento && <p>Complemento: {o.complemento}</p>}
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </Grid>
          <div style={{ marginTop: "30px" }}>
            <Grid container justify="center">
              <Grid item>
                <Button variant="contained" color="secondary" onClick={this.props.onClose}>
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

const mapStateToProps = (state) => {
  return {
    setToken: state.setToken,
    perfil: state.perfil,
  };
};

export default connect(mapStateToProps)(DialogLog);
