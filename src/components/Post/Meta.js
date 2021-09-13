import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { FaCalendar } from "react-icons/fa/";
import { FaUser } from "react-icons/fa/";
import { FaTag } from "react-icons/fa/";

import "./meta.scss";

const Meta = props => {
  const { prefix, category } = props;

  return (
    <p className="meta">
      <span className="span-meta">
        <FaCalendar size={18} /> {prefix}
      </span>
      {/*<span>*/}
      {/*  <FaUser size={18} /> {authorName}*/}
      {/*</span>*/}
      {category && (
        <span className="span-meta">
          <FaTag size={18} />
          <Link to={`/category/${category.split(" ").join("-")}`}>{category}</Link>
        </span>
      )}
    </p>
  );
};

Meta.propTypes = {
  prefix: PropTypes.string.isRequired,
  category: PropTypes.string
};

export default Meta;
