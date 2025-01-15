import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid2";

const modalStyle = {
    width: "30%",
    height: "20%",
    position: "absolute",
    top: "30%",
    left: "35%",
    backgroundColor: "white",
    padding: "50px",
    justifyContent: "space-between",
    flexDirection: "column"
}
export default function DictionaryViewer({ dictionaryType, headers, editRecord, removeRecord }) {

    const dictionary = useSelector(state => state.dictionaries[dictionaryType])
    const [ isDeleteModalVisible, setModalVisibility ] = useState(false);
    const [ deletedInd, setDeletedInd ] = useState(null)
    const closeDeleteWarning = event => {
        setModalVisibility(false)
        setDeletedInd(null)
    }

    const openDeleteWarning = () => {
        setModalVisibility(true)
    }

    const onDelete = ind => event => {
        setDeletedInd(ind);
        openDeleteWarning();
    }

    const confirmDelete = event => {
        console.log(deletedInd)
        if (deletedInd) removeRecord(deletedInd);
        closeDeleteWarning(event)
    }

    return (
        <>
            <TableContainer component={ Paper }>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            { headers.map((header, ind) => (<TableCell key={ind}>{header.label}</TableCell>)) }
                            <TableCell>Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dictionary.map((row, ind) => (
                            <TableRow
                                key={ind}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                { headers.map((header, ind) => (
                                    <TableCell key={ind}>
                                        {
                                            header.eval
                                                ? header.eval(row)
                                                : row[header.value]
                                        }
                                    </TableCell>)) }
                                <TableCell>
                                    <Button onClick={() => editRecord(row)}>Редагувати</Button>
                                    <Button onClick={ onDelete(ind) }>Видалити</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={ isDeleteModalVisible }
                onClose={ closeDeleteWarning }
            >
                    <Grid container style={modalStyle}>
                        <Grid>
                            Ви точно хочете видалити запис?
                        </Grid>
                        <Grid alignSelf="end">
                            <Button
                                onClick={ confirmDelete }
                            >
                                Підтверджую видалення
                            </Button>
                        </Grid>
                    </Grid>
            </Modal>
        </>
    )
}