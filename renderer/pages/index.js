import { Provider } from "react-redux"
import { store } from "../store"

import MainScreen from "../windows/main-screen/MainScreen";
import PersonnelOrderScreen from "../windows/personnel-order/PersonnelOrderScreen";
import DictionaryManagementScreen from "../windows/dictionary-management/DictionaryManagementScreen";
import { useState } from "react";
import { Button } from "@mui/material";

const Home = () => {

    const [ currentPage, setCurrentPage ] = useState("main")
    return (
        <Provider store={store}>
            <Button
                style={{padding: "15px", borderRadius: "0"}}
                color="success"
                variant="contained"
                onClick={() => setCurrentPage("main")}
            >
                Наказ командира по стройовій
            </Button>
            <Button
                style={{padding: "15px", borderRadius: "0"}}
                color="info"
                variant="contained"
                onClick={() => setCurrentPage("personnel")}
            >
                Наказ командира по особовому складу
            </Button>
            <Button
                style={{padding: "15px", backgroundColor: "navy", borderRadius: "0"}}
                variant="contained"
                onClick={() => setCurrentPage("admin")}
            >
                Редагувати посади/підрозділи/персонал
            </Button>
            { currentPage === "main" && <MainScreen /> }
            { currentPage === "personnel" && <PersonnelOrderScreen /> }
            { currentPage === "admin" && <DictionaryManagementScreen /> }
        </Provider>
    );
};

export default Home;
