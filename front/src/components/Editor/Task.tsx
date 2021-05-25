import './Task.scss';
import { useParams } from 'react-router-dom';
import RegionSelector, { ClickEvent, Region } from './RegionSelector';
import { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import axios from 'axios';

export interface Task {
    file: any;
    taskName: string;
    prompt: string;
    success: number;
    failure: number;
    regions: [Region];
    clicks: [ClickEvent]
};

export default function Tasks() {
    const [task, setTask] = useState<Task>();
    const { name } = useParams<any>();
    
    useEffect(() => {  
        const loadTask = async () => {
            const task = await axios.get(`/api/tasks/${name}`);
            setTask(task.data);
        };

        loadTask();
    }, [name]);

    const percentage = (n:number, total:number) => {
        if (total === 0) {
            return '0.00';
        }

        return ((n / total) * 100).toFixed(2);
    }

    const successClicks = task?.clicks.filter(c => c.type === 'success') || [];
    const failureClicks = task?.clicks.filter(c => c.type === 'failure') || [];

    const success = successClicks.length;
    const failure = failureClicks.length;
    const total = success + failure;
    const successPercentage = percentage(success, total);
    const failurePercentage = percentage(failure, total); 

    const metrics = {
        total,
        success,
        successPercentage,
        failure,
        failurePercentage
    };

    function toBase64(arr: any[]) {
        const result = btoa(
            arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
            
        return `data:image/png;base64,${result}`;
    };

    const image = task?.file ? <img src={toBase64(task.file.data)} alt="d" /> : null;

    return (
        <div className="task">
            <Typography variant="h3">
                {task?.taskName}
            </Typography>
            <div className="map">
                {image}
                <RegionSelector onChange={() => {}} clicks={task?.clicks || []} value={task?.regions}/>
            </div>
            <Card className="url">
                <Box p={2}>
                    Test URL: <Link href={`/test/task/${task?.taskName}`}>{`/test/task/${task?.taskName}`}</Link>
                </Box>
            </Card>
            <div className="results">
                <Card className="success">
                    <Typography variant="h6">
                        Success
                    </Typography>
                    <Typography variant="h4">
                        {metrics.successPercentage}%
                    </Typography>
                    {metrics.success} of {metrics.total}
                </Card>
                <Card className="failure">
                    <Typography variant="h6">
                        Failure
                    </Typography>
                    <Typography variant="h4">
                        {metrics.failurePercentage}%
                    </Typography>
                    {metrics.failure} of {metrics.total}
                </Card>
            </div>
        </div>
    );
}