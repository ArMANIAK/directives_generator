import MainScreen from "../windows/main-screen/MainScreen";
import { Provider } from "react-redux"

import { store } from "../store"
const Home = () => {

    return (
        <Provider store={store}>
            <MainScreen />
        </Provider>
    );
};

export default Home;
