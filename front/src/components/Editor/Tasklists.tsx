import './Tasklists.scss';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import Link from '@material-ui/core/Link';
import { Task } from './Tasks';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import { TASKLIST_QUERY } from '../Testing/Test';

export interface Tasklist {
    tasklistName: string;
    taskNames: string[];
};

export default function Tasklists() {
    const history = useHistory();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tasklists, setTasklists] = useState<Tasklist[]>([]);
    const [tasklistsOpen, setTasklistsOpen] = useState<boolean[]>([]);

    const create = () => {
        history.push('/task-lists/create');
    };

    const load = async () => {
        const asyncTasklists = axios.get('/api/tasklists');
        const asyncTasks = axios.get('/api/tasks');
        const tasklists = (await asyncTasklists).data;
        
        setTasklists(tasklists);
        setTasks((await asyncTasks).data);
        setTasklistsOpen(tasklists.map(() => true));
    };

    useEffect(() => { load(); }, []);

    const findTask = (taskName: string) => {
        return tasks.find(task => task.taskName === taskName);
    };

    const toggleTasklistsOpen = (index: number) => {
        setTasklistsOpen(tasklistsOpen.map((state, i) => i === index ? !state : state));
    };

    return (
        <div className="task-lists">
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Tasklist Name</TableCell>
                            <TableCell>Task Name</TableCell>
                            <TableCell>Prompt</TableCell>
                            <TableCell>Test Link</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {tasklists.map((tasklist, i) => (
                        <React.Fragment key={tasklist.tasklistName}>
                            <TableRow>
                                <TableCell onClick={() => toggleTasklistsOpen(i)}>
                                    <IconButton aria-label="expand row" size="small">
                                        {tasklistsOpen[i] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell component="th" scope="row" onClick={() =>  toggleTasklistsOpen(i)}>
                                    {tasklist.tasklistName}
                                </TableCell>
                                <TableCell onClick={() => toggleTasklistsOpen(i)}></TableCell>
                                <TableCell onClick={() => toggleTasklistsOpen(i)}></TableCell>
                                <TableCell onClick={() => toggleTasklistsOpen(i)}>
                                    <Link href={`/test/task/${tasklist?.taskNames[0]}?${TASKLIST_QUERY}=${tasklist?.tasklistName}`}>{`/test/task/${tasklist?.taskNames[0]}?${TASKLIST_QUERY}=${tasklist?.tasklistName}`}</Link>
                                </TableCell>
                            </TableRow>
                            {
                                tasklistsOpen[i] ? tasklist.taskNames.map((taskName, i) => {
                                    const task = findTask(taskName);
                                    return task ? (
                                        <TableRow key={task.taskName + i} className="task">
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell component="th" scope="row">
                                                <Link href={`/tasks/${task.taskName}`}>{task.taskName}</Link>
                                            </TableCell>
                                            <TableCell className="prompt">{task.prompt}</TableCell>
                                            <TableCell><Link href={`/test/task/${task?.taskName}`}>{`/test/task/${task?.taskName}`}</Link></TableCell>
                                        </TableRow>
                                    ) : null;
                                }) : null
                            }
                        </React.Fragment>
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