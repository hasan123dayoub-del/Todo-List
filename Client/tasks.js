async function renderTasksPage() {
  const pendingBody = document.getElementById("pendingBody");
  if (!pendingBody) return;

  try {
    const users = await getData(USERS_URL);
    const tasks = await getData(TASKS_URL);

    const getUserName = (userId) => {
      const u = users.find((user) => String(user.id) === String(userId));
      return u ? u.name : "غير محدد";
    };

    const renderSection = (taskList, tbodyElement) => {
      tbodyElement.innerHTML = "";
      if (taskList.length === 0) {
        tbodyElement.innerHTML =
          "<tr><td colspan='2' class='text-center text-muted py-3'>لا توجد مهام في هذا القسم</td></tr>";
        return;
      }
      taskList.forEach((task) => {
        const row =
          "<tr>" +
          "<td>" +
          task.taskName +
          "</td>" +
          "<td><i class='bi bi-person-circle text-secondary me-1'></i>" +
          getUserName(task.userId) +
          "</td>" +
          "</tr>";
        tbodyElement.innerHTML += row;
      });
    };

    renderSection(
      tasks.filter((t) => t.status === "pending"),
      document.getElementById("pendingBody"),
    );
    renderSection(
      tasks.filter((t) => t.status === "in-progress"),
      document.getElementById("progressBody"),
    );
    renderSection(
      tasks.filter((t) => t.status === "completed"),
      document.getElementById("completedBody"),
    );
  } catch (error) {
    console.error("فشل في عرض المهام:", error);
  }
}

async function loadTasksForAction(actionType) {
  try {
    const tasks = await getData(TASKS_URL);
    const users = await getData(USERS_URL);

    const selectId =
      actionType === "delete" ? "deleteTaskSelect" : "editTaskSelect";
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '<option value="">-- اختر المهمة --</option>';

    const getUserName = (userId) => {
      const u = users.find((user) => String(user.id) === String(userId));
      return u ? u.name : "غير محدد";
    };

    tasks.forEach((task) => {
      const option = document.createElement("option");
      option.value = task.id;

      const userName = getUserName(task.userId);
      option.textContent = task.taskName + " (المستلم: " + userName + ")";

      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("فشل في تحميل المهام:", error);
  }
}

async function loadUsersForTask() {
  try {
    const users = await getData(USERS_URL);
    const selectElement = document.getElementById("taskUserSelect");
    selectElement.innerHTML = '<option value="">-- اختر المستخدم --</option>';
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("فشل في تحميل المستخدمين:", error);
  }
}

document
  .getElementById("addTaskForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newTask = {
      userId: document.getElementById("taskUserSelect").value,
      taskName: document.getElementById("taskNameInput").value,
      status: document.getElementById("taskStatusSelect").value,
    };
    try {
      await postData(TASKS_URL, newTask);
      bootstrap.Modal.getInstance(
        document.getElementById("addTaskModal"),
      ).hide();
      e.target.reset();
      renderTasksPage();
    } catch (error) {
      alert("حدث خطأ أثناء إضافة المهمة");
    }
  });

document
  .getElementById("deleteTaskForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskId = document.getElementById("deleteTaskSelect").value;
    if (!taskId) return;
    try {
      await deleteData(TASKS_URL + "/" + taskId);
      bootstrap.Modal.getInstance(
        document.getElementById("deleteTaskModal"),
      ).hide();
      renderTasksPage();
    } catch (error) {
      alert("حدث خطأ أثناء الحذف");
    }
  });

document
  .getElementById("editTaskForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskId = document.getElementById("editTaskSelect").value;
    const newStatus = document.getElementById("newTaskStatus").value;
    if (!taskId) return;

    try {
      const currentTask = (await getData(TASKS_URL)).find(
        (t) => t.id === taskId,
      );
      const updatedTask = { ...currentTask, status: newStatus };

      await putData(TASKS_URL + "/" + taskId, updatedTask);
      bootstrap.Modal.getInstance(
        document.getElementById("editTaskModal"),
      ).hide();
      renderTasksPage();
    } catch (error) {
      alert("حدث خطأ أثناء التعديل");
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  renderTasksPage();
});
