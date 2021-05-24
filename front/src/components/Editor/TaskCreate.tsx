import './TaskCreate.scss';
import FileDrop from './FileDrop';
import RegionSelector, { Region } from './RegionSelector';
import { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';

export default function Tasks() {
    const [file, setFile] = useState<File | null>(null);
    const [taskName, setTaskName] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [regions, setRegions] = useState<Region[]>();
    const history = useHistory();

    const onSave = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file as any);
            formData.append('taskName', taskName);
            formData.append('prompt', prompt);
            formData.append('regions', JSON.stringify(regions));
            await axios.post('/api/tasks', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            history.push('/tasks');
        }
    };

    const form = file 
        ? <div className="form">
            <div><TextField label="Task Name" variant="outlined" fullWidth onChange={(e) => setTaskName(e.target.value)} value={taskName} /></div>
            <div><TextField multiline={true} label="Prompt" variant="outlined" fullWidth rows={4} onChange={(e) => setPrompt(e.target.value)} value={prompt}/></div>
            <div><Button variant="contained" color="primary" onClick={onSave}>Save</Button></div>
        </div>
        : null;

    const regionSelector = file
        ? <RegionSelector onChange={setRegions} value={regions} />
        : null;

    const promptElement = file
        ? <Card className="card">
            <Box className="prompt" p={2}>
                <Typography variant="body1">
                    Click and drag to make success regions. Right click on a sucess region to delete.
                </Typography>
            </Box>
        </Card>
        : null;

    return (
        <div className="task-create">
            {promptElement}
            <div className="screenshot">
                <FileDrop onChange={setFile} value={file} />
                {regionSelector}
            </div>
            {form}
        </div>
    );
}