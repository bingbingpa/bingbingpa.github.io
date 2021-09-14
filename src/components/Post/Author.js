import React from "react";
import PropTypes from "prop-types";

import config from "../../../content/meta/config";

import "./author.scss";

const Author = props => {
  const { note } = props;

  return (
    <React.Fragment>
      <div className="author">
        <div className="avatar">
          <img src={config.gravatarImgMd5} alt={config.siteTitle} />
        </div>
        <div className="note" dangerouslySetInnerHTML={{ __html: note }} />
      </div>
    </React.Fragment>
  );
};

Author.propTypes = {
  note: PropTypes.string.isRequired
};

export default Author;
