import React from "react";
import { connect } from "react-redux";
import { DropdownItem, DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { menuSelect } from "../actions";

class Menu extends React.Component {
  state = { menuAberto: true };

  toggleMenu = () => {
    this.setState({ menuAberto: !this.state.menuAberto });
  };

  render() {
    return (
      <Dropdown isOpen={this.state.menuAberto} toggle={this.toggleMenu}>
        <DropdownToggle color="primary" caret>
          Menu
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
          <DropdownItem header style={{ textAlign: "center" }}>
            {this.props.perfil}
          </DropdownItem>
          <DropdownItem divider />
          {this.props.opcoesMenu.map((opcao) => {
            return this.props.perfil === opcao.perfil ? (
              <DropdownItem
                style={{ textAlign: "right" }}
                onClick={(e) => this.props.menuSelect(opcao.acao)}
                key={opcao.acao}
              >
                {opcao.label}
              </DropdownItem>
            ) : (
              ""
            );
          })}
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
  return { opcoesMenu: state.opcoesMenu };
};

export default connect(mapStateToProps, { menuSelect })(Menu);
