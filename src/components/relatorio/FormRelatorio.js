import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Chart } from "react-google-charts";
import html2canvas from "html2canvas";
import { PDFDownloadLink, Page, Document, Text, View, Image } from "@react-pdf/renderer";
import { getRelatorio } from "../Api";
import { setMessage, setTela } from "../../actions";
import {
  CircularProgress,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  Slide,
} from "@material-ui/core";

class FormRelatorio extends React.Component {
  state = {
    data: null,
    wait: false,
    showForm: true,
    erros: [],
    dt_inicio: moment().add(-1, "MONTH").format("YYYY-MM-DD"),
    dt_fim: moment().format("YYYY-MM-DD"),
    pdf: null,
    showPdf: false,
  };

  loadData = (res) => {
    let horasPorDentista = [["Dentista", "Disponibilidade", "Alocação"]].concat(
      res.data.horasPorDentista.map((r) => [
        r.nome,
        parseFloat(r.horas_disponiveis),
        parseFloat(r.horas_utilizadas),
      ])
    );
    let atdPorConvenio = [["Convênio", "Quantidade"]].concat(
      res.data.atdPorConvenio.map((r) => [r.dm_convenio, parseInt(r.qtd)])
    );
    let atdPorProcedimento = [["Procedimento", "Quantidade"]].concat(
      res.data.atdPorProcedimento.map((r) => [r.nome, parseInt(r.qtd)])
    );
    let atendimentoPorDia = [["Data", "Quantidade"]].concat(
      res.data.atendimentoPorDia.map((r) => [moment(r.dia).format("DD/MM"), parseInt(r.qtd)])
    );
    let cancelamentoPorMotivo = [["Motivo", "Quantidade"]].concat(
      res.data.cancelamentoPorMotivo.map((r) => [r.complemento, parseInt(r.qtd)])
    );
    let reagendamentoPorPerfil = [["Perfil", "Quantidade"]].concat(
      res.data.reagendamentoPorPerfil.map((r) => [r.perfil, parseInt(r.qtd)])
    );
    this.setState({
      wait: false,
      data: [
        horasPorDentista,
        atdPorConvenio,
        atdPorProcedimento,
        atendimentoPorDia,
        cancelamentoPorMotivo,
        reagendamentoPorPerfil,
      ],
      showForm: false,
    });
  };

  showError = (err) => {
    this.setState({ wait: false, errorMessage: err });
  };

  gerarRelatorio = () => {
    getRelatorio(
      this.state.dt_inicio,
      this.state.dt_fim,
      this.props.perfil.id,
      this.props.setToken,
      this.loadData,
      this.showError
    );
    this.setState({ wait: true });
  };

  validate = (e) => {
    const campo = e.target.id;
    const valor = e.target.value;
    let errors = this.state.erros;
    errors[campo] = valor === null || valor === "" ? "Preenchimento obrigatório" : null;
    if (
      this.state.dt_inicio &&
      this.state.dt_fim &&
      moment(this.state.dt_inicio).isSameOrAfter(this.state.dt_fim)
    ) {
      errors["dt_inicio"] = "Deve vir antes.";
    }
    if (this.state.dt_fim && moment().isBefore(this.state.dt_fim)) {
      errors["dt_fim"] = "No máximo até a data atual";
    }
    this.setState({ erros: errors });
  };

  exportar = () => {
    const dt_inicio = moment(this.state.dt_inicio).format("DD/MM/YY");
    const dt_fim = moment(this.state.dt_fim).format("DD/MM/YY");
    const input = document.getElementById("chart_div");
    html2canvas(input, { scrollY: -window.scrollY }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      let print = (
        <Document>
          <Page size="A4">
            <View
              style={{
                margin: 20,
                padding: 2,
                flexGrow: 1,
              }}
            >
              <Text
                style={{
                  margin: 12,
                  fontSize: 20,
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                CO-TCC - Relatório de {dt_inicio} a {dt_fim}
              </Text>
              <Image source={imgData} />
            </View>
          </Page>
        </Document>
      );
      this.setState({ pdf: print });
    });
    this.setState({ showPdf: true });
  };

  render() {
    const erros = this.state.erros;
    const ok = !erros.dt_inicio && !erros.dt_fim;
    return (
      <div className="WizForm">
        <Typography style={{ textAlign: "center" }} variant="h5" component="div">
          Relatório
        </Typography>
        {!this.state.showForm && (
          <Typography style={{ textAlign: "center" }} variant="h6" component="div">
            {moment(this.state.dt_inicio).format("DD/MM/YY - ")}
            {moment(this.state.dt_fim).format("DD/MM/YY")}
          </Typography>
        )}
        {this.state.wait && (
          <CircularProgress
            style={{
              margin: "0px auto",
            }}
          />
        )}
        {!this.state.wait && (
          <div>
            {this.state.showForm && (
              <div className="WizForm">
                <TextField
                  id="dt_inicio"
                  label="De"
                  type="date"
                  error={erros.dt_inicio !== null && erros.dt_inicio !== undefined}
                  helperText={erros.dt_inicio}
                  value={this.state.dt_inicio}
                  onChange={(e) => {
                    this.setState({ dt_inicio: e.target.value });
                    this.validate(e);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onBlur={this.validate}
                  className="FormTextField"
                />
                <TextField
                  id="dt_fim"
                  label="Até"
                  type="date"
                  error={erros.dt_fim !== null && erros.dt_fim !== undefined}
                  helperText={erros.dt_fim}
                  value={this.state.dt_fim}
                  onChange={(e) => {
                    this.setState({ dt_fim: e.target.value });
                    this.validate(e);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onBlur={this.validate}
                  className="FormTextField"
                />
                <div style={{ marginTop: "30px" }}>
                  <Button
                    variant="contained"
                    disabled={!ok}
                    color={ok ? "primary" : "default"}
                    onClick={this.gerarRelatorio}
                  >
                    Gerar
                  </Button>
                </div>
              </div>
            )}
            {!this.state.showForm && (
              <div>
                <div id="chart_div">
                  <div id="chart0">
                    <Chart
                      width={"100%"}
                      height={250}
                      chartType="BarChart"
                      data={this.state.data[0]}
                      options={{
                        title: "Disponibilidade e Alocação",
                        chartArea: { width: "60%" },
                        hAxis: {
                          title: "Horas",
                        },
                        vAxis: {
                          title: "Dentistas",
                        },
                      }}
                    />
                  </div>
                  <div id="chart1">
                    <Chart
                      width={"100%"}
                      height={250}
                      chartType="PieChart"
                      data={this.state.data[1]}
                      options={{
                        title: "Atendimentos x Convênio",
                      }}
                    />
                  </div>
                  <div id="chart2">
                    <Chart
                      width={"100%"}
                      height={250}
                      chartType="PieChart"
                      data={this.state.data[2]}
                      options={{
                        title: "Atendimentos x Procedimento",
                      }}
                    />
                  </div>
                  <div id="chart3">
                    <Chart
                      width={"100%"}
                      height={250}
                      chartType="LineChart"
                      data={this.state.data[3]}
                      options={{
                        title: "Atendimentos x Dia",
                        chartArea: { width: "60%" },
                        hAxis: {
                          title: "Dia",
                        },
                        vAxis: {
                          title: "Atendimentos",
                        },
                      }}
                    />
                  </div>
                  <div id="chart4">
                    <Chart
                      width={"100%"}
                      height={250}
                      chartType="PieChart"
                      data={this.state.data[4]}
                      options={{
                        title: "Cancelamentos x Motivo",
                      }}
                    />
                  </div>
                  <div id="chart5">
                    <Chart
                      width={"100%"}
                      height={250}
                      chartType="PieChart"
                      data={this.state.data[5]}
                      options={{
                        title: "Reagendamentos x Perfil",
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: "30px" }}>
                  <Grid container justify="center" spacing={2}>
                    <Grid item>
                      <Button variant="contained" color="secondary" onClick={this.exportar}>
                        PDF
                      </Button>
                    </Grid>

                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => this.setState({ showForm: true })}
                      >
                        Voltar
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </div>
            )}
          </div>
        )}
        {this.state.showPdf && (
          <Dialog
            open={this.state.showPdf}
            TransitionComponent={React.forwardRef(function Transition(props, ref) {
              return <Slide direction="up" ref={ref} {...props} />;
            })}
            keepMounted
            onClose={(e) => {
              this.setState({ showPdf: false });
            }}
            onClick={(e) => {
              this.setState({ showPdf: false });
            }}
          >
            {this.state.pdf !== null && (
              <PDFDownloadLink document={this.state.pdf} fileName={"relatorio.pdf"}>
                {({ blob, url, loading, error }) => (loading ? "Loading document..." : "Download")}
              </PDFDownloadLink>
            )}
          </Dialog>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    setToken: state.setToken,
    message: state.message,
    tela: state.tela,
    perfil: state.perfil,
  };
};

export default connect(mapStateToProps, { setMessage, setTela })(FormRelatorio);
