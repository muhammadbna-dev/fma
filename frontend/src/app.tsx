import { Engine } from "@/engine";
import { selectModel } from "@/redux/features/model/reducer";
import { useAppSelector } from "@/redux/hooks";

const App = () => {
	const model = useAppSelector(selectModel);
	const engine = new Engine(model);

	return (
		<div className="w-full h-full flex items-center justify-center">
			{engine.render()}
		</div>
	);
};

export default App;
