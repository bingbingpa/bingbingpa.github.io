import { FaTag } from "react-icons/fa/";
import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";
import { ThemeContext } from "../layouts";
import Article from "../components/Article/";
import Headline from "../components/Article/Headline";
import List from "../components/List";
import Seo from "../components/Seo";

import "./category.scss";

const CategoryPage = props => {
  const {
    data: {
      posts: { edges: posts }
    }
  } = props;

  // Create category list
  const categories = {};
  posts.forEach(edge => {
    const {
      node: {
        frontmatter: { category }
      }
    } = edge;

    if (category) {
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(edge);
    }
  });

  const categoryList = [];

  for (var key in categories) {
    categoryList.push([key, categories[key]]);
  }

  return (
    <React.Fragment>
      <Article>
        <header>
          <Headline title="Posts by categories" />
        </header>
        {categoryList.map(item => (
          <section key={item[0]}>
            <h2 className="h2-category">
              <FaTag /> {item[0]}
            </h2>
            <List edges={item[1]} />
          </section>
        ))}
      </Article>

      <Seo />
    </React.Fragment>
  );
};

CategoryPage.propTypes = {
  data: PropTypes.object.isRequired
};

export default CategoryPage;

//eslint-disable-next-line no-undef
export const query = graphql`
  query PostsQuery {
    posts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//posts/[0-9]+.*--/" } }
      sort: { fields: [fields___prefix], order: DESC }
    ) {
      edges {
        node {
          excerpt
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
