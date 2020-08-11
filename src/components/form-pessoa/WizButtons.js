import React from "react";
import { Button } from "@material-ui/core";
import { Container, Row, Col } from "reactstrap";

const WizButtons = (props) => {
  const { previousPage, stepNumber, stepCount, pristine, submitting, valid } = props.resto;
  return (
    <Container className="WizFormNavButtonsContainer" fluid={true}>
      <Row>
        <Col xs={4} md={{ size: 2, offset: 3 }}>
          <Button variant="contained" color="secondary" onClick={props.onCancel}>
            Cancelar
          </Button>
        </Col>
        <Col xs={2} md={2}>
          {stepNumber > 1 && (
            <Button variant="contained" onClick={previousPage}>
              Voltar
            </Button>
          )}
        </Col>
        <Col xs={4} md={{ size: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!valid || pristine || submitting}
          >
            {stepNumber < stepCount ? "Avançar" : "Concluir"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
export default WizButtons;
