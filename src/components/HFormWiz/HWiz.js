import React from "react";
import { Button } from "@material-ui/core";

class HWiz extends React.Component {
  state = { atual: 0 };

  changeStep = (inc) => {
    const passos = this.props.steps;
    if (inc > 0) {
      if (!this.props.isValid(this.state.atual)) {
        return;
      }
    }
    let step = this.state.atual + inc;
    if (step === passos.length) {
      this.props.onSubmit();
    } else {
      this.setState({ atual: step });
    }
  };

  renderPasso = () => {
    const passos = this.props.steps;
    if (!passos || passos.length === 0) {
      return <div>Carregando...</div>;
    }
    return passos[this.state.atual];
  };

  renderFooter = () => {
    const passos = this.props.steps;
    const fim = passos ? passos.length : 0;
    const atual = this.state.atual;
    return (
      <div>
        {atual < fim ? (
          <Button variant="contained" color="secondary" onClick={this.props.onCancel}>
            Cancelar
          </Button>
        ) : null}
        {atual > 0 && atual < fim ? (
          <Button variant="contained" onClick={(e) => this.changeStep(-1)}>
            Voltar
          </Button>
        ) : null}
        {atual < fim ? (
          <Button variant="contained" color="primary" onClick={(e) => this.changeStep(1)}>
            {atual === fim - 1 ? "Concluir" : "Avançar"}
          </Button>
        ) : null}
      </div>
    );
  };

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        {this.renderPasso()}
        {this.renderFooter()}
      </div>
    );
  }
}

export default HWiz;
