const TasksService = (tasks) => {
  function addTaskById(task) {
    tasks.push(task);
  }

  function getTaskById(id = "task-1") {
    if (typeof id !== "string") {
      throw `L'id ${id} n'est pas une string`;
    }

    return tasks.find((task) => task.id == id);
  }

  function editTaskById(id, text, color, deadline, state) {
    let taskId = tasks.findIndex((task) => task.id == id);
    let task = tasks.find((task) => task.id == id);
    if (taskId !== -1) {
      const taskCopy = { ...task };
      taskCopy.text = text;
      taskCopy.color = color;
      taskCopy.deadline = deadline;
      taskCopy.done = state;
      tasks[taskId] = taskCopy;
    }
  }

  function deleteTaskById(id) {
    let taskId = tasks.findIndex((task) => task.id == id);
    if (taskId !== -1) {
      tasks.splice(taskId, 1);
    }
  }

  return {
    tasks,
    addTaskById,
    getTaskById,
    editTaskById,
    deleteTaskById,
  };
};

export default TasksService;
