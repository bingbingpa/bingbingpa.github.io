import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";

import Search from "../components/Search";
import Seo from "../components/Seo";

import "./search.scss";

const SearchPage = props => {
  const {
    data: {
      search: { edges: edges }
    }
  } = props;

  return (
    <React.Fragment>
      <Search edges={edges} />
      <Seo />
    </React.Fragment>
  );
};

SearchPage.propTypes = {
  data: PropTypes.object.isRequired
};

export default SearchPage;

//eslint-disable-next-line no-undef
export const query = graphql`
  query SearchQuery {
    search: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//posts/[0-9]+.*--/" } }
      sort: { order: DESC, fields: frontmatter___title }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200)
          id
          frontmatter {
            title
            category
          }
          fields {
            slug
            prefix
          }
        }
      }
    }
  }
`;
