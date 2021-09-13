import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { FaArrowRight } from "react-icons/fa/";
import { FaArrowLeft } from "react-icons/fa/";

import "./nextPrev.scss";

const NextPrev = props => {
  const {
    theme,
    next: {
      fields: { prefix: nextPrefix, slug: nextSlug } = {},
      frontmatter: { title: nextTitle } = {}
    } = {},
    prev: {
      fields: { prefix: prevPrefix, slug: prevSlug } = {},
      frontmatter: { title: prevTitle } = {}
    } = {}
  } = props;

  return (
    <React.Fragment>
      <div className="links">
        {nextSlug && (
          <Link to={nextSlug}>
            <FaArrowRight />
            <h4>
              {nextTitle} <time>{nextPrefix} </time>
            </h4>
          </Link>
        )}
        {prevSlug && (
          <Link to={prevSlug}>
            <FaArrowLeft />
            <h4>
              {prevTitle} <time>{prevPrefix}</time>
            </h4>
          </Link>
        )}
      </div>
    </React.Fragment>
  );
};

NextPrev.propTypes = {
  next: PropTypes.object,
  prev: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default NextPrev;
