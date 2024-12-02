import { Engine } from "@/engine";
import { INITIAL_DATA } from "@/model";

const App = () => {
	const engine = new Engine(INITIAL_DATA);

	return (
		<div className="w-full h-full flex items-center justify-center">
			{engine.render()}
		</div>
	);
};

export default App;
