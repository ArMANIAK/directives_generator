import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid2";

const viewerStyle = {
    height: "500px",
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "gray solid 1px",
    overflowY: "scroll"
}

const modalStyle = {
    width: "40%",
    height: "20%",
    position: "absolute",
    top: "30%",
    left: "30%",
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
        <Grid style={viewerStyle}>
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
                            <Typography>
                                Ви точно хочете видалити запис?
                            </Typography>
                        </Grid>
                        <Grid container flexDirection="row" justifyContent="space-around">
                            <Button
                                variant="contained"
                                onClick={ closeDeleteWarning }
                            >
                                Скасувати
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={ confirmDelete }
                            >
                                Підтверджую видалення
                            </Button>
                        </Grid>
                    </Grid>
            </Modal>
        </Grid>
    )
}