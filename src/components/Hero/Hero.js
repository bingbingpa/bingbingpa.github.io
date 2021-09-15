import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaArrowDown } from "react-icons/fa/";
import config from "../../../content/meta/config";

import "./hero.scss";

const Hero = props => {
  const { scrollToContent } = props;
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth - 15;
    const texts = config.matrixTest.split("");
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#490";
      ctx.font = fontSize + "px arial";
      for (let i = 0; i < drops.length; i++) {
        let text = texts[Math.floor(Math.random() * texts.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height || Math.random() > 0.98) drops[i] = 0;
        drops[i]++;
      }
    }

    setTimeout(function() {
      setInterval(draw, 33);
    });
  }, []);

  return (
    <React.Fragment>
      <section className="hero">
        <canvas ref={canvasRef} className="matrix" />
        <button className="button-matrix" onClick={scrollToContent} aria-label="scroll">
          <FaArrowDown />
        </button>
      </section>
    </React.Fragment>
  );
};

Hero.propTypes = {
  scrollToContent: PropTypes.func.isRequired
};

export default Hero;
