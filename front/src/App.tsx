import React from 'react';
import './App.scss';

import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Tasks from './components/Editor/Tasks';
import Tasklists from './components/Editor/Tasklists';
import TaskCreate from './components/Editor/TaskCreate';
import TasklistsCreate from './components/Editor/TasklistsCreate';
import Task from './components/Editor/Task';
import Test from './components/Testing/Test';
import { useLocation } from 'react-router-dom'

function App() {
  const routes = [
    {
      name: 'tasks',
      component: <Tasks />
    },
    {
      name: 'task-lists',
      component: <Tasklists />
    }
  ];

  const location = useLocation();
  const history = useHistory();

  const handleChange = (event: any, newValue: any) => {
    const route = routes[newValue];
    history.push(`/${route.name}`);
  };

  const tabValue = () => {
    const pathName = location.pathname.replace('/', '');
    return routes.findIndex(r => pathName.includes(r.name))
  };

  return (
    <div className="app">
      <AppBar position="static">
        <Toolbar>
          <Switch>
            <Route path="/test/task/:name">
              <Typography variant="h6">
                Click Test
              </Typography>
            </Route>
            <Route>
              <Typography variant="h6">
                Click Test Editor
              </Typography>
              <Tabs value={tabValue()} onChange={handleChange}>
                <Tab label="Tasks" />
                <Tab label="Task Lists" />
              </Tabs>
            </Route>
          </Switch>
        </Toolbar>
      </AppBar>
      <Box p={6}>
        <Switch>
          <Route path="/tasks/create">
            <TaskCreate />
          </Route>
          <Route path="/task-lists/create">
            <TasklistsCreate />
          </Route>
          <Route path="/task-lists">
            <Tasklists />
          </Route>
          <Route path="/tasks/:name" children={<Task />}/>
          <Route path="/tasks">
            <Tasks />
          </Route>
          <Route path="/test/task/:name" children={<Test />}></Route>
        </Switch>
      </Box>
    </div>
  );
}

export default App;
