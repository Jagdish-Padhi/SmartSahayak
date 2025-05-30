import "../public/chatBot.css";
import { Link } from "react-router-dom";

export default function Chat({ src, altText = "SmartSahayak" }) {
  return (
    <Link
      to="/doubt"
      className="ai-bubble-container hover:scale-110 transition duration-300"
    >
      <div className="ai-bubble">
        <img src={src} alt={altText} className="ai-image" />
      </div>
    </Link>
  );
}
