import { useState } from "react";
import ViewerPopup from "./ViewPopup";

export default function ProductBox() {
  const [isPopupOpen, setPopupOpen] = useState(false);

  return (
    <div>
      <div className="product-box" onClick={() => setPopupOpen(true)}>
        <img src="/bike.jpg" alt="Product" width="200" />
        <p>Click to View in 3D</p>
      </div>
      {isPopupOpen && <ViewerPopup onClose={() => setPopupOpen(false)} />}
    </div>
  );
}
