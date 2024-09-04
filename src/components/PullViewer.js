import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";
import {GenerateName} from "@/utilities/generators";

const absence_type = require('@/dictionaries/absence_types.json');
export default function PullViewer({ pull }) {
    const rows = pull.map(el => {
        const activity = el.activity === "arrive" ? "прибуття" : (el.activity === 'depart' ? 'вибуття' : 'інші пункти');
        const servant = GenerateName(el.servant, 'nominative');
        const destination = el.destination === '' ? 'Не релевантно' : el.destination;
        const absence = absence_type.find(item => item.value === el.absence_type).label ?? 'Не релевантно';
        const date_start = el.date_start;
        return { activity, servant, destination, absence, date_start }
    })

    return (
        <TableContainer component={ Paper }>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Пункти, що стосуються</TableCell>
                        <TableCell>Військовослужбовець/працівник ЗСУ</TableCell>
                        <TableCell>Тип відсутності</TableCell>
                        <TableCell>Куди</TableCell>
                        <TableCell>з</TableCell>
                        <TableCell>Дії</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, ind) => (
                        <TableRow
                            key={ind}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.activity}
                            </TableCell>
                            <TableCell>{row.servant}</TableCell>
                            <TableCell>{row.absence}</TableCell>
                            <TableCell>{row.destination}</TableCell>
                            <TableCell>{row.date_start}</TableCell>
                            <TableCell>
                                <Button>Edit</Button>
                                <Button>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}