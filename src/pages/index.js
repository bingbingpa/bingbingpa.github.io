import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";
import Blog from "../components/Blog";
import Hero from "../components/Hero";
import Seo from "../components/Seo";

import "./index.scss";

class IndexPage extends React.Component {
  separator = React.createRef();

  scrollToContent = () => {
    this.separator.current.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  render() {
    const {
      data: {
        posts: { edges: posts = [] }
      }
    } = this.props;

    return (
      <React.Fragment>
        <Hero scrollToContent={this.scrollToContent} />
        <hr className="hr-index" ref={this.separator} />

        <Blog posts={posts} />
        <Seo />
      </React.Fragment>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.object.isRequired
};

export default IndexPage;

//eslint-disable-next-line no-undef
export const query = graphql`
  query IndexQuery {
    posts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//posts/[0-9]+.*--/" } }
      sort: { fields: [fields___prefix], order: DESC }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200)
          fields {
            slug
            prefix
          }
          frontmatter {
            title
            category
          }
        }
      }
    }
  }
`;
