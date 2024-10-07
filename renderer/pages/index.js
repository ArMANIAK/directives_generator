import MainScreen from "./MainScreen";
import { Provider } from "react-redux"

import { store } from "../store/store"
const Home = () => {

    return (
        <Provider store={store}>
            <MainScreen />
        </Provider>
    );
};

export default Home;
