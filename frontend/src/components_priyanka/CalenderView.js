import FullCalendar from "@fullcalendar/react"; 
import dayGridPlugin from "@fullcalendar/daygrid"; 
import { Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"; 
import { useState } from "react";

const CalendarView = ({ data }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Format task data to be used by FullCalendar
  const events = data.map((task) => ({
    title: task.task,
    start: task.deadline,  // Use task's deadline as start date
    end: task.deadline,    // Same as start for a single-day event
    extendedProps: {       // Store additional task data in extendedProps
      description: task.desc,
      subject: task.subject,
      completion: task.precentComp,
    },
  }));

  // Handle date click to show task details in a dialog
  const handleDateClick = (info) => {
    const taskOnDate = data.filter(
      (task) => new Date(task.deadline).toDateString() === new Date(info.dateStr).toDateString()
    );

    if (taskOnDate.length > 0) {
      setSelectedTask(taskOnDate[0]);  // Get the first task on the clicked date
      setOpenDialog(true);  // Open the dialog with task details
    }
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  return (
    <Paper>
      <div>
        {/* FullCalendar component */}
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}  // Pass formatted events to FullCalendar
          weekends={true}
          dateClick={handleDateClick}  // Trigger when a date is clicked
        />

        {/* Dialog to show task details */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent>
            {selectedTask && (
              <div>
                <p><strong>Task:</strong> {selectedTask.task}</p>
                <p><strong>Description:</strong> {selectedTask.desc}</p>
                <p><strong>Subject:</strong> {selectedTask.subject}</p>
                <p><strong>Deadline:</strong> {selectedTask.deadline}</p>
                <p><strong>Completion:</strong> {selectedTask.precentComp}%</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Paper>
  );
};

export default CalendarView;
