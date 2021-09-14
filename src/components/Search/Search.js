import React, { useState } from "react";
import PropTypes from "prop-types";
import List from "../List";
import Article from "../Article";
import { AiOutlineSearch } from "react-icons/all";

import "./search.scss";
import Blog from "../Blog";

const Search = props => {
  const { edges } = props;
  const emptyQuery = "";

  const [state, setState] = useState({
    filteredData: [],
    query: emptyQuery
  });

  const handleInputChange = event => {
    const query = event.target.value;
    const posts = edges || [];

    const filteredData = posts.filter(post => {
      const { description, title } = post.node.frontmatter;
      return (
        (description && description.toLowerCase().includes(query.toLowerCase())) ||
        (title && title.toLowerCase().includes(query.toLowerCase()))
      );
    });

    setState({
      query,
      filteredData
    });
  };

  const renderSearchResult = () => {
    const { query, filteredData } = state;
    const hasSearchResults = filteredData && query !== emptyQuery;
    const posts = hasSearchResults ? filteredData : [];

    return (
      posts &&
      posts.map((node, index) => {
        return node;
      })
    );
  };

  return (
    <React.Fragment>
      <Article>
        <div className="form-search">
          <input className="input-search" placeholder="search" onChange={handleInputChange} />
          <AiOutlineSearch />
        </div>
        <Blog posts={renderSearchResult()} />
      </Article>
    </React.Fragment>
  );
};

Search.propTypes = {
  edges: PropTypes.array.isRequired
};

export default Search;
