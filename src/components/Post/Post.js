import React from "react";
import PropTypes from "prop-types";
import "prismjs/themes/prism-okaidia.css";

import Headline from "../Article/Headline";
import Bodytext from "../Article/Bodytext";
import Meta from "./Meta";
import Author from "./Author";
import NextPrev from "./NextPrev";

const Post = props => {
  const {
    post: {
      html,
      fields: { prefix, slug },
      frontmatter: { title, category }
    },
    authornote,
    facebook,
    next: nextPost,
    prev: prevPost
  } = props;

  return (
    <React.Fragment>
      <header>
        <Headline title={title} />
        <Meta prefix={prefix} category={category} />
      </header>
      <Bodytext html={html} />
      <footer>
        {/*<Share post={post} theme={theme} />*/}
        <Author note={authornote} />
        <NextPrev next={nextPost} prev={prevPost} />
        {/*<Comments slug={slug} facebook={facebook} theme={theme} />*/}
      </footer>
    </React.Fragment>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  authornote: PropTypes.string.isRequired,
  facebook: PropTypes.object.isRequired,
  next: PropTypes.object,
  prev: PropTypes.object
};

export default Post;
