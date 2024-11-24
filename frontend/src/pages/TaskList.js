import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, notification, Popconfirm, Row, Col, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import api from '../services/Api'; // Import api.js

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const TaskList = ({ plannerId }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks related to the specific planner
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/getTasks/${plannerId}`);
        setTasks(response.data);
        setIsLoading(false);
      } catch (error) {
        notification.error({ message: 'Error fetching tasks', description: error.message });
        setIsLoading(false);
      }
    };

    if (plannerId) {
      fetchTasks();
    }
  }, [plannerId]); // Re-fetch tasks when the plannerId changes

  // Handle task deletion
  const handleDelete = async (taskId) => {
    try {
      const response = await api.delete(`/deleteTask/${taskId}`);
      if (response.data.success) {
        notification.success({ message: 'Task deleted successfully!' });
        // Refresh the tasks list
        setTasks(tasks.filter(task => task._id !== taskId));
      }
    } catch (error) {
      notification.error({ message: 'Error deleting task', description: error.message });
    }
  };

  return (
    <div className="task-list">
      <Title level={3}>Tasks for Selected Planner</Title>
      
      {isLoading ? (
        <Spin size="large" />
      ) : tasks.length === 0 ? (
        <Paragraph>No tasks available for this planner.</Paragraph>
      ) : (
        <Row gutter={16}>
          {tasks.map((task) => (
            <Col span={8} key={task._id}>
              <Card
                hoverable
                style={{ width: '100%', marginBottom: 16 }}
                actions={[
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => console.log('Edit Task', task)} 
                  />,
                  <Popconfirm
                    title="Are you sure you want to delete this task?"
                    onConfirm={() => handleDelete(task._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      danger
                    />
                  </Popconfirm>,
                ]}
              >
                <Meta
                  title={<Title level={4}>{task.title}</Title>}
                  description={`Due: ${task.dueDate}`}
                />
                <Paragraph>{task.taskDescription}</Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    type="link"
                    icon={<CheckCircleOutlined />}
                    onClick={() => console.log('Mark as Completed')}
                  />
                  <Button
                    type="link"
                    icon={<CloseCircleOutlined />}
                    onClick={() => console.log('Mark as Incomplete')}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default TaskList;
