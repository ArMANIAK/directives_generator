import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Typography,
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material";
import {useEffect, useState} from "react";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid2";
import { IoMdArrowDropdown, IoMdArrowDropup, IoIosCloseCircleOutline } from "react-icons/io";

const viewerStyle = {
    flexDirection: "column",
    flexWrap: "nowrap",
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
export default function Viewer({ recordList, headers, editRecord, removeRecord }) {
    const [ isDeleteModalVisible, setModalVisibility ] = useState(false);
    const [ deletedInd, setDeletedInd ] = useState(null);
    const [ list, setList ] = useState(recordList.map((el, ind) => { return { ...el, id: ind }}));
    const [ sortOrder, setSortOrder ] = useState();
    const [ sortColumn, setSortColumn ] = useState();
    const [ evalFunc, setEvalFunc ] = useState(null);
    const [ filterTerm, setFilterTerm ] = useState("")

    useEffect(() => {
        let newList = recordList.map((el, ind) => { return { ...el, index: ind }});
        if (filterTerm) newList = filterList();
        if (sortColumn) newList = sortList(newList);
        setList(newList);
    }, [ recordList, sortOrder, sortColumn, filterTerm ]);

    const handleFilterTermChange = event => {
        setFilterTerm(event.target.value);
    }

    const handleFilterTermReset = () => {
        setFilterTerm("");
    }

    const filterList = () => {
        let term = filterTerm.toLowerCase();
        return recordList
            .map((el, ind) => { return { ...el, index: ind }})
            .filter(el => headers.some(header => header.eval
                ? header.eval(el).toLowerCase().indexOf(term) !== -1
                : el[header.value].toLowerCase().indexOf(term) !== -1));
    }

    const handleSorting = (field, evaluationFunc) => {
        if (evaluationFunc !== evalFunc) setEvalFunc(() => evaluationFunc);
        setSortOrder(state => {
            let newState = undefined;
            if (field !== sortColumn || !state) {
                newState = "ASC";
            } else if (state === "ASC")
                newState = "DESC";
            if (field !== sortColumn) setSortColumn(field)
            return newState;
        })
    }

    const sortList = newList => {
        let shouldInvert = sortOrder === "ASC" ? 1 : -1;
        return newList.sort((a, b) => {
            let aValue = evalFunc ? evalFunc(a) : a[sortColumn];
            let bValue = evalFunc ? evalFunc(b) : b[sortColumn];
            if (aValue < bValue) return -1 * shouldInvert;
            else if (aValue > bValue) return 1 * shouldInvert;
            return 0;
        })
    }

    const closeDeleteWarning = () => {
        setModalVisibility(false);
        setDeletedInd(null);
    }

    const openDeleteWarning = () => {
        setModalVisibility(true);
    }

    const onDelete = ind => () => {
        setDeletedInd(ind);
        openDeleteWarning();
    }

    const confirmDelete = event => {
        if (deletedInd || deletedInd === 0) removeRecord(deletedInd);
        closeDeleteWarning(event)
    }

    console.log(list)

    return (
        <Grid container style={viewerStyle}>
            <Grid container spacing={2} size={12} justifyContent="flex-end">
                <TextField
                    size="small"
                    style={{ paddingRight: "0" }}
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="end">
                                <IconButton onClick={ handleFilterTermReset }>
                                    <IoIosCloseCircleOutline />
                                </IconButton>
                            </InputAdornment>,
                            style: { paddingRight: "0" }
                        }
                    }}
                    value={ filterTerm }
                    onChange={ handleFilterTermChange }
                />
            </Grid>
            <Grid size={12}>
                <TableContainer component={ Paper }>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                { headers.map((header, ind) => (
                                    <TableCell key={ind}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid
                                                container
                                                flexDirection="column"
                                                spacing={0}
                                                onClick={ () => handleSorting(header.label, header.eval) }
                                            >
                                                { (sortColumn !== header.label || sortColumn === header.label && sortOrder !== "ASC") && <IoMdArrowDropup/> }
                                                { (sortColumn !== header.label || sortColumn === header.label && sortOrder !== "DESC") && <IoMdArrowDropdown/> }
                                            </Grid>
                                            <Grid>
                                                { header.label }
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                )) }
                                <TableCell>
                                    Дії
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.map((row, ind) => (
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
                                        <Grid
                                            container
                                            flexDirection="column"
                                            spacing={0}
                                        >
                                            <Button onClick={ editRecord(row.index) }>Редагувати</Button>
                                            <Button onClick={ onDelete(row.index) }>Видалити</Button>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
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
                    <Grid container flexDirection="row" justifyContent="space-between">
                        <Grid size={5}>
                            <Button
                                variant="contained"
                                onClick={ closeDeleteWarning }
                            >
                                Скасувати
                            </Button>
                        </Grid>
                        <Grid size={5}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={ confirmDelete }
                            >
                                Видалити
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Modal>
        </Grid>
    )
}