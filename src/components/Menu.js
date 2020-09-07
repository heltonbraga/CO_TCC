import React from "react";
import { connect } from "react-redux";
import { DropdownItem, DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { menuSelect, setTela } from "../actions";
import { CircularProgress } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

class Menu extends React.Component {
  state = { menuAberto: this.props.perfil && this.props.perfil.perfil !== "paciente" };

  toggleMenu = () => {
    this.setState({ menuAberto: !this.state.menuAberto });
  };

  render() {
    return (
      <Dropdown isOpen={this.state.menuAberto} toggle={this.toggleMenu}>
        <DropdownToggle color="primary">
          <MenuIcon />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header style={{ textAlign: "center" }}>
            {this.props.user.name}
          </DropdownItem>
          <DropdownItem style={{ textAlign: "center" }}>
            <img
              src={this.props.user.picture}
              alt="Profile"
              className="nav-user-profile rounded-circle"
              width="70"
            />
          </DropdownItem>
          {this.props.perfil ? (
            <div>
              <DropdownItem header style={{ textAlign: "center" }}>
                {this.props.perfil.perfil}
              </DropdownItem>
              <DropdownItem divider />
              {this.props.opcoesMenu.map((opcao) => {
                return this.props.perfil.perfil === opcao.perfil ? (
                  <DropdownItem
                    style={{ textAlign: "right" }}
                    onClick={(e) => {
                      this.props.menuSelect(opcao.acao);
                      this.props.setTela("");
                    }}
                    key={opcao.acao}
                  >
                    {opcao.label}
                  </DropdownItem>
                ) : (
                  ""
                );
              })}
            </div>
          ) : (
            <CircularProgress />
          )}
          <DropdownItem divider />
          <DropdownItem style={{ textAlign: "right" }} onClick={this.props.logout}>
            Sair
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

const mapStateToProps = (state) => {
  return { opcoesMenu: state.opcoesMenu, perfil: state.perfil, tela: state.tela };
};

export default connect(mapStateToProps, { menuSelect, setTela })(Menu);
