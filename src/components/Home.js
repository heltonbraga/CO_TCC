import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";
import { SocialIcon } from "react-social-icons";

import whatsappIcon from "./img/whatsappIcon.png";
import fotoHome from "./img/fotoHome.jpg";

class Home extends React.Component {
  formatarTelefone = (num) => {
    return "(" + num.slice(0, 2) + ") " + num.slice(2, 7) + " " + num.slice(7);
  };

  renderButtonContato = (contato) => {
    return (
      <Button style={{ backgroundColor: "#25d366" }}>
        Contato: {this.formatarTelefone(contato)} <img alt="whatsapp" src={whatsappIcon} />
      </Button>
    );
  };

  render() {
    let texto = "Olá, eu gostaria de marcar um atendimento na clínica TCC.";
    let msg = window.encodeURIComponent(texto);
    let contato = "85999545922";
    return this.props.perfil ? (
      <Redirect to={"/" + this.props.perfil.perfil} />
    ) : (
      <Container className="Home" fluid={true}>
        <Row>
          <Col className="Col-Home" xs={12} md={8}>
            <h3>Cuidamos dos seus dentes da 1ª infância à 3ª idade.</h3>
          </Col>
          <Col xs={12} md={4}>
            <Button color="primary">Agende sua consulta</Button>
          </Col>
        </Row>
        <Row>
          <Col md={4} style={{ textAlign: "justify" }}>
            <br />
            Na clínica odontológica TCC você encontra profissionais capacitados nas principais
            especialidades com equipamentos de primeira linha para melhor atendê-lo.
            <br />
            Siga nossas redes sociais para receber dicas importantes para sua saúde bucal além de
            ficar a par das novidades da odontologia para o seu sorriso!
            <br />
            Agende sua consulta pelo telefone, whatsapp ou site.
            <br />
            <br />
            <span className="desk">
              <a href={"https://api.whatsapp.com/send?phone=+55" + contato + "&text=" + msg}>
                {this.renderButtonContato(contato)}
              </a>
            </span>
            <span className="cell">
              <a href={"whatsapp://send?phone=+55" + contato + "&text=" + msg}>
                {this.renderButtonContato(contato)}
              </a>
            </span>
            <br />
            <br />
          </Col>
          <Col md={8}>
            <img className="Foto-Home" alt="fotos" src={fotoHome} />
            <br />
            <br />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={10}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.947359813254!2d-43.9945897130099!3d-19.926622974833684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa696f128d61d43%3A0x8427c4b88fb834c3!2sAv.%20Trinta%20e%20Um%20de%20Mar%C3%A7o%2C%201020%20-%20Dom%20Cabral%2C%20Belo%20Horizonte%20-%20MG%2C%2030535-000!5e0!3m2!1spt-BR!2sbr!4v1593475791609!5m2!1spt-BR!2sbr"
              width="100%"
              height="85%"
              frameBorder="0"
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              title="maps"
            ></iframe>
            <br />
            <span className="texto-secundario">
              Av. Trinta e Um de Março, nº 1020, Bairro Dom Cabral, Belo Horizonte - MG
            </span>
            <br />
          </Col>
          <Col xs={12} md={1}>
            <SocialIcon url="http://linkedin.com/company/puc-minas" />{" "}
            <SocialIcon url="https://instagram.com/napucminas" />{" "}
            <SocialIcon url="https://facebook.com/pucminasoficial" />
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return { perfil: state.perfil };
};

export default connect(mapStateToProps, {})(Home);
