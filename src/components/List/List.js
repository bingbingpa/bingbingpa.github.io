import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import "./list.scss";

const List = props => {
  const { edges } = props;

  return (
    <React.Fragment>
      <ul className="ul-list">
        {edges.map(edge => {
          const {
            node: {
              frontmatter: { title },
              fields: { slug }
            }
          } = edge;

          return (
            <li className="li-list" key={slug}>
              <Link to={slug}>{title}</Link>
            </li>
          );
        })}
      </ul>
    </React.Fragment>
  );
};

List.propTypes = {
  edges: PropTypes.array.isRequired
};

export default List;
