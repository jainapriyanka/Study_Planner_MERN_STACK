// StudyPlanPage.js
import React, { useState, useEffect } from 'react';
import { Button, List, Popconfirm, notification } from 'antd';
import api from '../services/Api'; // Import api.js for making API requests
import AddTaskForm from './AddTaskForm'; // Import AddTaskForm
import StudyPlanForm from './StudyPlanForm'; // Import the new StudyPlanForm
import TaskList from './TaskList';
import  {motion} from 'framer-motion';


const StudyPlanPage = () => {
  const [studyPlans, setStudyPlans] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [currentPlanForTask, setCurrentPlanForTask] = useState(null);
  const [selectedPlannerId, setSelectedPlannerId] = useState(null);

  // Fetch study plans when the component mounts
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

  // Handle the deletion of a study plan
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/delete/${id}`);
      if (!response.data) {
        throw new Error('Failed to delete the study plan!');
      }
      notification.success({ message: 'Study Plan deleted successfully!' });

      // Refresh the list of study plans
      const fetchResponse = await api.get('/getAllPlanners');
      setStudyPlans(fetchResponse.data);
    } catch (error) {
      notification.error({ message: error.message });
    }
  };

  // Open Task Form modal
  const openTaskForm = (plan) => {
    setCurrentPlanForTask(plan);
    setIsTaskModalVisible(true);
  };

  const handleStudyPlanSave = () => {
    // Refresh study plans after saving or updating
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
 // Handle View Tasks button click
 const handleViewTasks = (planId) => {
  setSelectedPlannerId(planId);
  setIsModalVisible(true); // Open the modal when "View Tasks" is clicked
};

  return (
    <div className="study-plan-page">
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: '20px' }}
      >
        Add Study Plan
      </Button>
      <List
        itemLayout="horizontal"
        dataSource={studyPlans}
        renderItem={(plan) => (
          <List.Item
            actions={[
              <Button
                type="link"
                onClick={() => {
                  setCurrentPlan(plan);
                  setIsModalVisible(true);
                }}
              >
                Edit
              </Button>,
              <Popconfirm
                title="Are you sure you want to delete this study plan?"
                onConfirm={() => handleDelete(plan._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger>
                  Delete
                </Button>
              </Popconfirm>,
              <Button type="link" onClick={() => openTaskForm(plan)}>
                Add Task
              </Button>, // Add Task button
               <Button type="link" onClick={() => handleViewTasks(plan._id)}>
               View Tasks
             </Button>, // View Tasks button
            ]}
          >
            <List.Item.Meta
              title={plan.title}
              description={`Date: ${plan.createdAt} - ${plan.description}`}
            />
              {selectedPlannerId === plan._id && <TaskList plannerId={plan._id} />} {/* Show tasks only for the selected planner */}
          </List.Item>
        )}
      />
      {/* Use StudyPlanForm for adding/editing study plans */}
      <StudyPlanForm
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setCurrentPlan(null);
        }}
        currentPlan={currentPlan}
        onSave={handleStudyPlanSave}
      />

      {/* Modal for adding tasks */}
      <AddTaskForm
        visible={isTaskModalVisible}
        onClose={() => setIsTaskModalVisible(false)}
        plan={currentPlanForTask}
      />
       {/* Modal for View Tasks */}
       <Modal
        title="View Tasks"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {selectedPlannerId && <TaskList plannerId={selectedPlannerId} />}
        </motion.div>
      </Modal>
    </div>
  );
};

export default StudyPlanPage;
