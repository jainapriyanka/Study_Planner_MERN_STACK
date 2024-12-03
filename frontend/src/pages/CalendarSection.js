import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, Form, Input, Button } from 'antd';
import api from '../services/Api'; // Adjust based on your API file
import moment from 'moment'; // Import moment.js

const CalendarSection = () => {
  const [tasks, setTasks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks'); // Replace with the correct API endpoint
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when the component mounts
  }, []);

  // Render tasks on specific date cells
  const handleDateCellRender = (value) => {
    // Convert value to moment object and filter tasks by dueDate
    const currentTasks = tasks.filter((task) =>
      moment(task.dueDate).isSame(value, 'day') // Compare task's dueDate with the calendar date
    );
    return currentTasks.map(task => (
      <div key={task.taskId}>
        <Badge status={task.isCompleted ? 'success' : 'warning'} text={task.title} />
      </div>
    ));
  };

  // Handle date selection
  const handleDateSelect = (value) => {
    setSelectedDate(value);
    setVisible(true);
  };

  // Handle task form submission
  const handleAddTask = (values) => {
    api.post('/tasks', { ...values, dueDate: selectedDate })
      .then(() => {
        setVisible(false);
        fetchTasks(); // Refresh tasks after adding a new one
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });
  };

  return (
    <div>
      {/* Calendar component */}
      <Calendar
        dateCellRender={handleDateCellRender}
        onSelect={handleDateSelect}
      />
      
      {/* Modal for adding a new task */}
      <Modal
        title="Add Task"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddTask}>
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please enter the task title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add Task
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CalendarSection;
