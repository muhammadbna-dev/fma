import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "@/app";
import { store } from "@/redux/store";

import "@/index.css";

const dom = document.getElementById("root");
if (dom) {
	createRoot(dom).render(
		<StrictMode>
			<Provider store={store}>
				<div className="w-[100vw] h-[100vh]">
					<App />
				</div>
			</Provider>
		</StrictMode>,
	);
}
