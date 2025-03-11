import { TextField, Button, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    taskid: "",
    task: "",
    subject: "",
    desc: "",
    startdate: "",
    deadline: "",
    completed: false,
    percentComp: 0
  });

  const [tasks, setTasks] = useState([
    {
      taskid: 1,
      task: "History Essay",
      subject: "History",
      desc: "World War II analysis",
      startdate: "2025-03-05",
      deadline: "2025-03-10",
      completed: false,
      percentComp: 0
    },
    {
      taskid: 2,
      task: "Math Homework",
      subject: "Math",
      desc: "Algebra exercises",
      startdate: "2025-03-01",
      deadline: "2025-03-07",
      completed: false,
      percentComp: 0
    }
  ]);

  const handleClear = () => {
    setFormData({
      taskid: "",
      task: "",
      subject: "",
      desc: "",
      startdate: "",
      deadline: "",
      completed: false,
      percentComp: 0
    });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      completed: !prev.completed,
    }));
  };

  const handleSubmit = () => {
    if (formData.taskid) {
      // Update existing task logic
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.taskid === formData.taskid ? formData : task
        )
      );
    } else {
      // Create a new task
      setFormData((prev) => ({
        ...prev,
        taskid: Math.floor(Math.random() * 1000),
      }));
      setTasks((prev) => [...prev, formData]);
    }

    handleClear();
  };

  const handleDelete = (taskid) => {
    setTasks((prev) => prev.filter((task) => task.taskid !== taskid));
  };

  const handleEdit = (task) => {
    setFormData(task);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Grid2 container spacing={5} direction="row" justifyContent="center" alignItems="center">
        <Grid2 item md={4} sm={12}>
          <TextField
            name="task"
            label="Task"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.task}
            fullWidth
          />
        </Grid2>
        <Grid2 item md={4} sm={12}>
          <TextField
            name="subject"
            label="Subject"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.subject}
            fullWidth
          />
        </Grid2>
        <Grid2 item md={4} sm={12}>
          <TextField
            name="desc"
            label="Description"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.desc}
            fullWidth
          />
        </Grid2>
        <Grid2 item md={4} sm={12}>
          <TextField
            name="startdate"
            label="Start Date"
            type="date"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.startdate}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid2>
        <Grid2 item md={4} sm={12}>
          <TextField
            name="deadline"
            label="Deadline"
            type="date"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.deadline}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid2>

        {/* New Fields */}
        <Grid2 item md={4} sm={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.completed}
                onChange={handleCheckboxChange}
                name="completed"
                color="primary"
              />
            }
            label="Completed"
          />
        </Grid2>

        <Grid2 item md={4} sm={12}>
          <TextField
            name="percentComp"
            label="Percentage Completed"
            type="number"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.percentComp}
            fullWidth
            InputProps={{
              inputProps: { min: 0, max: 100 }
            }}
          />
        </Grid2>

        <Grid2 item md={4} sm={12}>
          <Button variant="contained" onClick={handleSubmit} fullWidth>
            {formData.taskid ? "Update Task" : "Add Task"}
          </Button>
        </Grid2>

        <Grid2 item md={4} sm={12}>
          <Button variant="contained" onClick={handleClear} fullWidth>
            Clear
          </Button>
        </Grid2>
      </Grid2>

      {/* Task List Table */}
      <Paper sx={{ marginTop: "2rem", padding: "1rem" }}>
        <Typography variant="h6" gutterBottom>
          Task List
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Task</strong></TableCell>
                <TableCell><strong>Subject</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Start Date</strong></TableCell>
                <TableCell><strong>Deadline</strong></TableCell>
                <TableCell><strong>Completed</strong></TableCell>
                <TableCell><strong>% Completed</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.taskid}>
                  <TableCell>{task.task}</TableCell>
                  <TableCell>{task.subject}</TableCell>
                  <TableCell>{task.desc}</TableCell>
                  <TableCell>{task.startdate}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>{task.completed ? "Yes" : "No"}</TableCell>
                  <TableCell>{task.percentComp}%</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(task)} style={{ marginRight: "8px" }}>
                      Edit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(task.taskid)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default CreateTask;
