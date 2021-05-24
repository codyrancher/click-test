import React from 'react';
import './Test.scss';
import { useParams } from 'react-router-dom';
import RegionSelector, { ClickEvent, Region } from '../Editor/RegionSelector';
import { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Tasklist } from '../Editor/Tasklists';
import CircularProgress from '@material-ui/core/CircularProgress';

export const TASKLIST_QUERY = 'task-list';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
export interface Task {
    file: any;
    taskName: string;
    prompt: string;
    success: number;
    failure: number;
    regions: [Region];
    clicks: [ClickEvent];
};

export default function Tasks() {
    const [task, setTask] = useState<Task>();
    const [done, setDone] = useState<boolean>(false);
    const [testName, setTestName] = useState<string>(useParams<any>().name);
    const query  = useQuery();
    const tasklistName = query.get(TASKLIST_QUERY);
    let [step, setStep] = useState<number>(0);

    const getNextTest = async () => {
        if (!tasklistName) {
            return null;
        }

        const taskList =  (await axios.get(`/api/tasklists/${tasklistName}`)).data as Tasklist;

        return  taskList?.taskNames[step + 1];
    };

    

    const loadTask = async () => {
        const task = await axios.get(`/api/tasks/${testName}`);
        setTask(task.data);

    };

    useEffect(() => {
        loadTask();
    }, [testName]);


    function toBase64(arr: any[]) {
        const result = btoa(
            arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
            
        return `data:image/png;base64,${result}`;
    };

    const onClick = async (ev: ClickEvent) => {
        await axios.put(`/api/tasks/${testName}/click`, ev);
        const nextTest = await getNextTest();

        if (nextTest) {
            setStep(step + 1);
            setTestName(nextTest);
            setTask(undefined);
        } else {
            setDone(true);
        }
    };



    const image = task?.file ? <img src={toBase64(task.file.data)} alt="d" /> : null;

    const test = <React.Fragment>
        <Card>
            <Box className="prompt" p={2}>
                <Typography variant="h6">
                    Prompt
                </Typography>
                <Typography variant="body1">
                    {task?.prompt}
                </Typography>
            </Box>
        </Card>
        <div className="map">
            {image}
            <RegionSelector onChange={() => {}} clicks={task?.clicks || []} value={task?.regions} onClick={onClick} hideRegion={true}/>
        </div>
    </React.Fragment> ;
        

    const thanks = <div className="thanks">
        <Typography variant="h6">Thanks for taking the test!</Typography>
    </div>;

    const loading = <div className="loading">
        <CircularProgress />
    </div>;

    const content = () => {
        if (done) {
            return thanks;
        }

        if (!task) {
            return loading;
        }

        return test;
    };

    return (
        <div className="test">
            {content()}
        </div>
    );
}