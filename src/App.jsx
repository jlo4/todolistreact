import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTodo from './AddTodo';

import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

function App() {
  const [todos, setTodos] = useState([]);

  const columnDefs = [
    { field: 'description', sortable: true, filter: true},
    { field: 'date', sortable: true, filter: true},
    { field: 'priority', sortable: true, filter: true},
    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const items = await fetch('https://todolist-77552-default-rtdb.firebaseio.com/items/.json');
      const data = await items.json();      
      addKeys(data);
    } catch (err) {
      console.error(err);
    }    
  };

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
      Object.defineProperty(item, 'id', {value: keys[index]}));
    console.log(valueKeys);
    setTodos(valueKeys);
  };

  const addTodo = async (todo) => {
    try {
      await fetch('https://todolist-77552-default-rtdb.firebaseio.com/items/.json', {
        method: 'POST',        
        body: JSON.stringify(todo)
      });
      await fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`https://todolist-77552-default-rtdb.firebaseio.com/items/${id}.json`, {
        method: 'DELETE'
      });
      await fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            TodoList
          </Typography>
        </Toolbar>
      </AppBar>
      <AddTodo addTodo={addTodo} />
      <div className="ag-theme-material" style={{ height: 400, width: 700 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={todos}>
        </AgGridReact>
      </div>
    </>
  );
}

export default App;
