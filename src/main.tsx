import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";

const dom = document.getElementById("root");
if (dom) {
	createRoot(dom).render(
		<StrictMode>
			<div>Hello</div>
		</StrictMode>,
	);
}
