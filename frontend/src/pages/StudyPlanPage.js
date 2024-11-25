import React, { useState, useEffect } from 'react';
import { Button, Table, Popconfirm, notification, Modal } from 'antd';
import { useNavigate } from 'react-router-dom'; 
import api from '../services/Api'; 
import AddTaskForm from './AddTaskForm'; 
import StudyPlanForm from './StudyPlanForm'; 
import { sendPushNotification } from '../services/PushNotificationService';


const StudyPlanPage = () => {
  const [studyPlans, setStudyPlans] = useState([]);
  const [isStudyPlanModalVisible, setIsStudyPlanModalVisible] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentPlanForTask, setCurrentPlanForTask] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/getAllPlanners');
        setStudyPlans(response.data);
      } catch (error) {
        notification.error({ message: error.message });
      }
    };

    fetchPlans();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/delete/${id}`);
      if (!response.data) {
        throw new Error('Failed to delete the study plan!');
      }
      notification.success({ message: 'Study Plan deleted successfully!' });

      const fetchResponse = await api.get('/getAllPlanners');
      setStudyPlans(fetchResponse.data);
    } catch (error) {
      notification.error({ message: error.message });
    }
  };

  const openAddTaskForm = (plan) => {
    setCurrentPlanForTask(plan); 
    setIsAddTaskModalVisible(true);
  };

  const handleStudyPlanSave = () => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/getAllPlanners');
        setStudyPlans(response.data);
      } catch (error) {
        notification.error({ message: error.message });
      }
    };
    fetchPlans();
  };

  const handleViewTasks = (planId) => {
    navigate(`/tasklist/${planId}`);
  };

  const closeModals = () => {
    setIsStudyPlanModalVisible(false);
    setIsAddTaskModalVisible(false);
    setCurrentPlan(null);
    setCurrentPlanForTask(null);
  };

  const columns = [
    {
      title: 'Plan Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button
            type="link"
            onClick={() => {
              setCurrentPlan(record);
              setIsStudyPlanModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this study plan?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => handleViewTasks(record._id)}
          >
            View Tasks
          </Button>
          <Button
            type="primary"
            onClick={() => openAddTaskForm(record)} // Open Add Task Form
          >
            Add Task
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="study-plan-page">
      <Button
        type="primary"
        onClick={() => setIsStudyPlanModalVisible(true)}
        style={{ marginBottom: '20px' }}
      >
        Add Study Plan
      </Button>
      <Table
        columns={columns}
        dataSource={studyPlans}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }} 
      />
      <StudyPlanForm
        visible={isStudyPlanModalVisible}
        onClose={closeModals}
        currentPlan={currentPlan}
        onSave={handleStudyPlanSave}
      />

      <AddTaskForm
        visible={isAddTaskModalVisible}
        onClose={closeModals}
        plan={currentPlanForTask} // Pass the current plan to the AddTaskForm
        sendPushNotification={sendPushNotification}
      />
    </div>
  );
};

export default StudyPlanPage;
