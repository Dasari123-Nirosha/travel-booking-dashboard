import { LoaderCircle } from "lucide-react";

function Loading({ text = "Loading..." }) {
  return (
    <div className="state-container">
      <LoaderCircle className="loading-spinner" size={38} />
      <p>{text}</p>
    </div>
  );
}

export default Loading;