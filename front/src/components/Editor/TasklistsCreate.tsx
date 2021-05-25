import './TasklistsCreate.scss';
import { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Task } from './Tasks';

export default function Tasks() {
    const [tasklistName, setTasklistName] = useState<string>('');
    const [taskOptions, setTasksOptions] = useState<Task[]>([]);
    const [taskNames, setTaskNames] = useState<string[]>([]);
    const history = useHistory();

    const loadTasks = async () => {
        const tasks = await axios.get('/api/tasks');
        setTasksOptions(tasks.data);
    };

    useEffect(() => { loadTasks(); }, []);

    const onSave = async () => {
        await axios.post('/api/tasklists', {
            tasklistName,
            taskNames
        });

        history.push('/task-lists');
    };

    const addTask = () => {
        setTaskNames([...taskNames, '']);
    };

    const removeTask = (index: number) => {
        const newTaskNames = [...taskNames];
        newTaskNames.splice(index, 1);
        setTaskNames(newTaskNames);
    };

    const onTaskSelected = (index: number, taskName: string) => {
        const newTaskNames = [...taskNames];
        newTaskNames.splice(index, 1, taskName);
        setTaskNames(newTaskNames);
    };

    return (
        <div className="tasklists-create">
            <div className="form">
                <div><TextField label="Tasklist Name" variant="outlined" fullWidth onChange={(e) => setTasklistName(e.target.value)} value={tasklistName} /></div>
                {taskNames.map((taskName, i) => (
                    <div className="task-row" key={taskName + i}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="select-label">
                                Task
                            </InputLabel>
                            <Select
                                labelId="select-label"
                                label="Task"
                                value={taskName}
                                onChange={(ev) => onTaskSelected(i, ev.target.value as any)}
                            >
                                {taskOptions.map(taskOption => (
                                    <MenuItem value={taskOption.taskName} key={taskOption.taskName}>{taskOption.taskName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="outlined" color="secondary" onClick={() => removeTask(i)}>-</Button>
                    </div>
                ))}
                <div className="buttons"><Button variant="contained" color="default" onClick={addTask}>Add Task</Button> <Button variant="contained" color="primary" onClick={onSave} disabled={!tasklistName || taskNames.length === 0 || taskNames.every(n => !n)}>Save</Button></div>
            </div>
        </div>
    );
}