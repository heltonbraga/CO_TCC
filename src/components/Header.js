import React from "react";
import { Container } from "reactstrap";

import logo from "./img/logo_sm.png";
import logo_cell from "./img/logo_xs.png";

export default class Header extends React.Component {
  render() {
    return (
      <Container className="App-header" fluid={true}>
        <img className="App-logo desk" alt="Logomarca" src={logo} />
        <img className="App-logo cell" alt="Logomarca" src={logo_cell} />
        <span className="App-name">Clínica Odontológica TCC</span>
      </Container>
    );
  }
}
