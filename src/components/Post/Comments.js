import React, { createRef, useEffect } from "react";
import config from "../../../content/meta/config";

const src = "https://utteranc.es/client.js";
const Comments = () => {
  const element = createRef();

  useEffect(() => {
    if (element.current === null) return;
    const utterances = document.createElement("script");

    const attributes = {
      src,
      repo: config.repo,
      "issue-term": "pathname",
      label: "Comment",
      theme: `github-light`,
      crossorigin: "anonymous",
      async: "true"
    };

    Object.entries(attributes).forEach(([key, value]) => {
      utterances.setAttribute(key, value);
    });

    element.current.appendChild(utterances);
  }, []);

  return <div ref={element} />;
};

export default Comments;
