import CamelSymbol from "./symbols/camel";
import CatSymbol from "./symbols/cat";
import CowSymbol from "./symbols/cow";
import EagleSymbol from "./symbols/eagle";
import GirrafeSymbol from "./symbols/girrafe";
import LeafSymbol from "./symbols/leaf";
import SharkSymbol from "./symbols/shark";
import UnicornSymbol from "./symbols/unicorn";
import WolfSymbol from "./symbols/wolf";

export const colors = [
  ["Branco Neve", "#ffffff", "#757575"],
  ["Grafite Urbano", "#1e1e2f", "#b8b8f2"],
  ["Azul Neon", "#2d89ef", "#a8d8ff"],
  ["Coral Vibrante", "#ff6b6b", "#e63939"],
  ["Violeta Futurista", "#6c5ce7", "#e0c6ff"],
  ["Verde Menta", "#00b894", "#90fff0"],
  ["Amarelo Solar", "#fdcb6e", "#c88200"],
  ["Rosa Pastel", "#ff9ff3", "#e600c6"],
  ["Verde Esmeralda", "#10ac84", "#95ffd5"],
  ["Dourado Suave", "#feca57", "#d98c00"],
  ["Cinza Aço", "#576574", "#dce6f2"],
  ["Preto Cósmico", "#222f3e", "#b1b9ff"],
];

export const formats = [
  [
    "Redonda",
    <svg width="1em" height="1em" viewBox="0 0 60 60">
      <circle
        cx="30"
        cy="30"
        r="25"
        style={{
          fill: "var(--base-color)",
          stroke: "var(--highlight-color)",
          strokeWidth: "2",
        }}
      />
    </svg>,
  ],
  [
    "Quadrada",
    <svg width="1em" height="1em" viewBox="0 0 60 60">
      <rect
        x="10"
        y="10"
        width="40"
        height="40"
        rx="6"
        style={{
          fill: "var(--base-color)",
          stroke: "var(--highlight-color)",
          strokeWidth: "2",
        }}
      />
    </svg>,
  ],
  [
    "Hexagonal",
    <svg width="1em" height="1em" viewBox="0 0 60 60">
      <polygon
        points="30,5 52,17 52,43 30,55 8,43 8,17"
        style={{
          fill: "var(--base-color)",
          stroke: "var(--highlight-color)",
          strokeWidth: "2",
        }}
      />
    </svg>,
  ],
  [
    "Diamante",
    <svg width="1em" height="1em" viewBox="0 0 60 60">
      <polygon
        points="30,5 55,30 30,55 5,30"
        style={{
          fill: "var(--base-color)",
          stroke: "var(--highlight-color)",
          strokeWidth: "2",
        }}
      />
    </svg>,
  ],
  [
    "Octogonal",
    <svg width="1em" height="1em" viewBox="0 0 60 60">
      <polygon
        points="20,5 40,5 55,20 55,40 40,55 20,55 5,40 5,20"
        style={{
          fill: "var(--base-color)",
          stroke: "var(--highlight-color)",
          strokeWidth: "2",
        }}
      />
    </svg>,
  ],
  [
    "Escudo",
    <svg width="1em" height="1em" viewBox="0 0 60 60">
      <path
        d="M30 5 L50 15 V30 C50 45 35 55 30 55 C25 55 10 45 10 30 V15 Z"
        style={{
          fill: "var(--base-color)",
          stroke: "var(--highlight-color)",
          strokeWidth: "2",
        }}
      />
    </svg>,
  ],
];

export const symbols = [
  ["Camelo", <CamelSymbol />],
  ["Gato", <CatSymbol />],
  ["Vaca", <CowSymbol />],
  ["Águia", <EagleSymbol />],
  ["Girafa", <GirrafeSymbol />],
  ["Folha", <LeafSymbol />],
  ["Tubarão", <SharkSymbol />],
  ["Unicórnio", <UnicornSymbol />],
  ["Lobo", <WolfSymbol />],
];
