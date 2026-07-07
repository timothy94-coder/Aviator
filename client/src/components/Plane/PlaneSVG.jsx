function PlaneSVG() {
  return (
    <svg
      width="90"
      height="60"
      viewBox="0 0 220 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tail Wing */}
      <polygon points="30,55 8,40 15,65" fill="#ffffff"/>

      {/* Main Wing */}
      <polygon points="90,55 55,20 125,48" fill="#ffffff"/>

      {/* Bottom Wing */}
      <polygon points="90,65 55,90 130,72" fill="#d9d9d9"/>

      {/* Body */}
      <ellipse
        cx="110"
        cy="60"
        rx="65"
        ry="20"
        fill="#d61f26"
      />

      {/* Nose */}
      <ellipse
        cx="175"
        cy="60"
        rx="18"
        ry="17"
        fill="#b31419"
      />

      {/* Cockpit */}
      <ellipse
        cx="120"
        cy="48"
        rx="12"
        ry="8"
        fill="#8fd3ff"
      />

      {/* White Stripe */}
      <rect
        x="70"
        y="54"
        width="90"
        height="6"
        fill="#ffffff"
      />

      {/* Propeller */}
      <g className="propeller">
        <rect
          x="190"
          y="35"
          width="4"
          height="50"
          rx="2"
          fill="#444"
        />

        <rect
          x="170"
          y="58"
          width="45"
          height="4"
          rx="2"
          fill="#444"
        />
      </g>

    </svg>
  );
}

export default PlaneSVG;