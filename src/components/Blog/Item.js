import { FaArrowRight } from "react-icons/fa/";
import { FaCalendar } from "react-icons/fa/";
import { FaTag } from "react-icons/fa/";
import { FaUser } from "react-icons/fa/";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

import "./item.scss";

const Item = props => {
  const {
    post: {
      excerpt,
      fields: { slug, prefix },
      frontmatter: {
        title,
        category
        // author
        // cover: {
        //   children: [{ fluid }]
        // }
      }
    }
  } = props;

  return (
    <React.Fragment>
      <li className="li-item">
        <Link to={slug} key={slug} className="link">
          {/*<div className="gatsby-image-outer-wrapper">*/}
          {/*  <Img fluid={fluid} />*/}
          {/*</div>*/}
          <h1 className="h1-item">
            {title} <FaArrowRight className="arrow" />
          </h1>
          <p className="item-meta">
            <span>
              <FaCalendar size={18} /> {prefix}
            </span>
            {/*<span>*/}
            {/*  <FaUser size={18} /> {author}*/}
            {/*</span>*/}
            {category && (
              <span>
                <FaTag size={18} /> {category}
              </span>
            )}
          </p>
          <p className="item-excerpt">{excerpt}</p>
        </Link>
      </li>
    </React.Fragment>
  );
};

Item.propTypes = {
  post: PropTypes.object.isRequired
};

export default Item;
