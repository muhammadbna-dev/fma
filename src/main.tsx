import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/app";

import "@/index.css";

const dom = document.getElementById("root");
if (dom) {
	createRoot(dom).render(
		<StrictMode>
			<div className="w-[100vw] h-[100vh]">
				<App />
			</div>
		</StrictMode>,
	);
}
