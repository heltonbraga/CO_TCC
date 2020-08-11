import React from "react";

class HStep extends React.Component {
  render() {
    return (
      <div>
        {this.props.key} - {this.props.title}
      </div>
    );
  }
}

export default HStep;
