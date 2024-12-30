import { Provider } from "react-redux"
import { store } from "../store"

import MainScreen from "../windows/main-screen/MainScreen";
import DictionaryManagementScreen from "../windows/dictionary-management/DictionaryManagementScreen";
import { useState } from "react";
import { Button } from "@mui/material";

const Home = () => {

    const [ currentPage, setCurrentPage ] = useState("main")
    return (
        <Provider store={store}>
            <Button
                style={{padding: "15px", backgroundColor: "green", borderRadius: "0"}}
                variant="contained"
                onClick={() => setCurrentPage("main")}
            >
                Наказ командира по стройовій
            </Button>
            <Button
                style={{padding: "15px", backgroundColor: "blue", borderRadius: "0"}}
                variant="contained"
                onClick={() => setCurrentPage("admin")}
            >
                Редагувати посади/підрозділи/персонал
            </Button>
            { currentPage === "main" && <MainScreen /> }
            { currentPage === "admin" && <DictionaryManagementScreen /> }
        </Provider>
    );
};

export default Home;
