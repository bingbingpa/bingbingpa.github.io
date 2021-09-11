import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FaArrowDown } from "react-icons/fa/";

const Hero = props => {
  const { scrollToContent, theme } = props;
  useEffect(() => {
    const c = document.getElementById("matrixCanvas");
    const ctx = c.getContext("2d");
    c.height = window.innerHeight;
    c.width = window.innerWidth - 15;
    const texts = "{{site.bgtext}}".split("");
    const fontSize = 12;
    const columns = c.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#490";
      ctx.font = fontSize + "px arial";
      for (let i = 0; i < drops.length; i++) {
        let text = texts[Math.floor(Math.random() * texts.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > c.height || Math.random() > 0.98) drops[i] = 0;
        drops[i]++;
      }
    }

    setInterval(draw, 33);
  }, []);

  return (
    <React.Fragment>
      <section className="hero">
        <canvas id="matrixCanvas" className="matrix" />
        <button onClick={scrollToContent} aria-label="scroll">
          <FaArrowDown />
        </button>
      </section>

      {/* --- STYLES --- */}
      <style jsx>{`
        .matrix {
          @media (max-width: 768px) {
            width: 100%;
          }
        }

        .hero {
          align-items: center;
          display: flex;
          justify-content: center;
        }

        button {
          position: absolute;
          top: 80%;
          background: ${theme.background.color.brand};
          border: 0;
          border-radius: 50%;
          font-size: ${theme.font.size.m};
          padding: ${theme.space.s} ${theme.space.m};
          cursor: pointer;
          width: ${theme.space.xl};
          height: ${theme.space.xl};

          &:focus {
            outline-style: none;
            background: ${theme.color.brand.primary.active};
          }

          :global(svg) {
            position: relative;
            top: 5px;
            fill: ${theme.color.neutral.white};
            stroke-width: 40;
            stroke: ${theme.color.neutral.white};
            animation-duration: ${theme.time.duration.long};
            animation-name: buttonIconMove;
            animation-iteration-count: infinite;
          }
        }

        @keyframes buttonIconMove {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </React.Fragment>
  );
};

Hero.propTypes = {
  scrollToContent: PropTypes.func.isRequired,
  backgrounds: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default Hero;
