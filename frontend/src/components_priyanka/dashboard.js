import Cards from "./CustomComponents/DashboardCard";
import CalenderView from "./CalenderView";
import PieChart from "./CustomComponents/PieChart";
import { Grid2 } from "@mui/material";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [pieData, setPieData] = useState([0, 0, 0, 0]);
  const [allData, setAllData] = useState([]);
  const [calenderData, setCalenderData] = useState([]);

  useEffect(() => {
    // Static Task Data
    const staticTasks = [
            { 
              taskid: 1, 
              task: "Math Homework", 
              subject: "Math", 
              desc: "Algebra problems", 
              startdate: "2025-03-10",  // Added start date
              deadline: "2025-03-15", 
              completed: true, 
              precentComp: 100 
            },
            { 
              taskid: 2, 
              task: "Science Report", 
              subject: "Science", 
              desc: "Write about Newton's Laws", 
              startdate: "2025-03-12",  // Added start date
              deadline: "2025-04-20", 
              completed: false, 
              precentComp: 50 
            },
            { 
              taskid: 3, 
              task: "History Essay", 
              subject: "History", 
              desc: "World War II analysis", 
              startdate: "2025-03-05",  // Added start date
              deadline: "2025-03-10", 
              completed: false, 
              precentComp: 0 
            },
            { 
              taskid: 4, 
              task: "Project Submission", 
              subject: "Computer Science", 
              desc: "Final year project", 
              startdate: "2025-03-12",  // Added start date
              deadline: "2025-03-18", 
              completed: false, 
              precentComp: 75 
            }
          ];          

    let comp = 0, due = 0, notSt = 0, inProg = 0;
    let calData = [];

    staticTasks.forEach((element) => {
      calData.push({ id: element.taskid, title: element.task, start_date: element.startdate,end_date: element.deadline, percent_complete: element.precentComp });
      if (element.completed) comp++;
      else if (Date.parse(element.deadline) < Date.now()) due++;
      else if (element.precentComp === 0) notSt++;
      else inProg++;
    });

    setPieData([comp, inProg, due, notSt]);
    setCalenderData(calData);
    setAllData(staticTasks);
  }, []);

  return (
    <div>
      <Grid2 container spacing={2} mb={5}>
        <Grid2 item sm={3} xs={12}><Cards color="#00E676" data={{ num: pieData[0], label: "Completed" }} /></Grid2>
        <Grid2 item sm={3} xs={12}><Cards color="#29B6F6" data={{ num: pieData[1], label: "In Progress" }} /></Grid2>
        <Grid2 item sm={3} xs={12}><Cards color="#F50057" data={{ num: pieData[2], label: "Due" }} /></Grid2>
        <Grid2 item sm={3} xs={12}><Cards color="#FBC02D" data={{ num: pieData[3], label: "Not Started" }} /></Grid2>
      </Grid2>

      <Grid2 container spacing={2} mb={5}>
        <Grid2 item sm={5} xs={12}>
          <PieChart data={[
            ["Task", "Value"],
            ["Completed", pieData[0]],
            ["In Progress", pieData[1]],
            ["Due", pieData[2]],
            ["Not Started", pieData[3]]
          ]} title="Task Overview" />
        </Grid2>
        <Grid2 item sm={7} xs={12}>
          <CalenderView data={calenderData} />
        </Grid2>
      </Grid2>
    </div>
  );
};

export default Dashboard;
