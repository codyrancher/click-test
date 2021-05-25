import './Tasks.scss';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import { Region } from './RegionSelector';
import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import Link from '@material-ui/core/Link';

export interface Task {
    file: string;
    taskName: string;
    prompt: string;
    regions: [Region];
};

export default function Tasks() {
    const history = useHistory();
    const [tasks, setTasks] = useState<Task[]>([]);
    const create = () => {
        history.push('/tasks/create');
    };

    const loadTasks = async () => {
        const tasks = await axios.get('/api/tasks');
        setTasks(tasks.data);
    };

    const removeTask = async (task: Task) => {
        const index = tasks.indexOf(task);
        if (index >= 0) {
            await axios.delete(`/api/tasks/${task.taskName}`);
            const newTasks = [...tasks];
            newTasks.splice(index, 1);
            setTasks(newTasks);
        }
    };

    useEffect(() => { loadTasks(); }, []);

    return (
        <div className="tasks">
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Prompt</TableCell>
                            <TableCell>Test Link</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.taskName}>
                            <TableCell component="th" scope="row">
                                <Link href={`/tasks/${task.taskName}`}>{task.taskName}</Link>
                            </TableCell>
                            <TableCell className="prompt">{task.prompt}</TableCell>
                            <TableCell><Link href={`http://${window.location.host}/test/task/${task?.taskName}`}>{`http://${window.location.host}/test/task/${task?.taskName}`}</Link></TableCell>
                            <TableCell align="right"><Button className="remove" variant="outlined" color="secondary" onClick={() => removeTask(task)}>-</Button></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Fab className="add" color="secondary" aria-label="add" onClick={create}>
                <AddIcon />
            </Fab>
        </div>
    );
}