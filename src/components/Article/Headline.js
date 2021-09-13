import React from "react";
import PropTypes from "prop-types";

import "./headline.scss";

const Headline = props => {
  const { title, children } = props;

  return (
    <React.Fragment>
      {title ? (
        <h1 className="h1-headline">{title}</h1>
      ) : (
        <h1 className="h1-headline">{children}</h1>
      )}
    </React.Fragment>
  );
};

Headline.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};

export default Headline;
