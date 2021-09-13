import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import "./item.scss";

const Item = props => {
  const { item: { label, to, icon: Icon } = {}, onClick } = props;

  return (
    <li className={"hiddenItem" in props ? "hiddenItem" : "item"} key={label}>
      <Link
        to={to}
        className={"hiddenItem" in props ? "inHiddenItem" : ""}
        onClick={onClick}
        data-slug={to}
      >
        {Icon && <Icon />} {label}
      </Link>
    </li>
  );
};

Item.propTypes = {
  item: PropTypes.object,
  hidden: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.func
};

export default Item;
