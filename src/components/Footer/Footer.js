import React from "react";
import PropTypes from "prop-types";

import "./footer.scss";

const Footer = props => {
  const { html } = props;

  return <footer className="footer" dangerouslySetInnerHTML={{ __html: html }} />;
};

Footer.propTypes = {
  html: PropTypes.string
};

export default Footer;
