import MainScreen from "../windows/main-screen/MainScreen";
import { Provider } from "react-redux"

import { store } from "../store"
import DictionaryManagementScreen from "../windows/dictionary-management/DictionaryManagementScreen";
const Home = () => {

    return (
        <Provider store={store}>
            {/*<MainScreen />*/}
            <DictionaryManagementScreen />
        </Provider>
    );
};

export default Home;
