async function renderUsersPage() {
  const tbody = document.getElementById("usersTableBody");
  if (!tbody) return;

  try {
    const users = await getData(USERS_URL);
    tbody.innerHTML = "";
    document.getElementById("userCountBadge").innerHTML =
      '<i class="bi bi-people-fill"></i> الإجمالي: ' + users.length;

    users.forEach((user) => {
      const row =
        "<tr>" +
        "<td><strong class='text-primary'>#" +
        user.id +
        "</strong></td>" +
        "<td>" +
        "<div class='d-flex align-items-center'>" +
        "<div class='bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2' style='width:30px; height:30px; font-size:14px;'>" +
        user.name.charAt(0) +
        "</div>" +
        user.name +
        "</div>" +
        "</td>" +
        "<td>" +
        user.email +
        "</td>" +
        "</tr>";
      tbody.innerHTML += row;
    });
  } catch (error) {
    console.error("فشل في عرض المستخدمين:", error);
  }
}

async function loadUsersForAction(actionType) {
  try {
    const users = await getData(USERS_URL);
    const selectId =
      actionType === "delete" ? "deleteUserSelect" : "editUserSelect";
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '<option value="">-- اختر المستخدم --</option>';

    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name + " (" + user.email + ")";
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("فشل في تحميل المستخدمين:", error);
  }
}

document
  .getElementById("editUserSelect")
  ?.addEventListener("change", async function () {
    const userId = this.value;
    if (!userId) {
      document.getElementById("editUserNameInput").value = "";
      document.getElementById("editUserEmailInput").value = "";
      return;
    }
    try {
      const users = await getData(USERS_URL);
      const user = users.find((u) => u.id === userId);
      if (user) {
        document.getElementById("editUserNameInput").value = user.name;
        document.getElementById("editUserEmailInput").value = user.email;
      }
    } catch (error) {
      console.error("فشل في جلب بيانات المستخدم:", error);
    }
  });

document
  .getElementById("addUserForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newUser = {
      name: document.getElementById("userNameInput").value,
      email: document.getElementById("userEmailInput").value,
    };
    try {
      await postData(USERS_URL, newUser);
      bootstrap.Modal.getInstance(
        document.getElementById("addUserModal"),
      ).hide();
      e.target.reset();
      renderUsersPage();
    } catch (error) {
      alert("حدث خطأ أثناء إضافة المستخدم");
    }
  });

document
  .getElementById("deleteUserForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = document.getElementById("deleteUserSelect").value;
    if (!userId) return;

    try {
      const tasks = await getData(TASKS_URL);

      const hasAssociatedTasks = tasks.some(
        (task) => String(task.userId) === String(userId),
      );
      if (hasAssociatedTasks) {
        alert(
          " لا يمكن حذف هذا المستخدم!\n\nالسبب: هذا المستخدم مرتبط بمهمة أو أكثر حالياً.\nيرجى حذف المهام المرتبطة به أو إعادة تعيينها لمستخدم آخر أولاً.",
        );
        return;
      }
      await deleteData(USERS_URL + "/" + userId);
      bootstrap.Modal.getInstance(
        document.getElementById("deleteUserModal"),
      ).hide();
      renderUsersPage();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  });

document
  .getElementById("editUserForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = document.getElementById("editUserSelect").value;
    if (!userId) return;

    const updatedUser = {
      name: document.getElementById("editUserNameInput").value,
      email: document.getElementById("editUserEmailInput").value,
    };

    try {
      await putData(USERS_URL + "/" + userId, updatedUser);
      bootstrap.Modal.getInstance(
        document.getElementById("editUserModal"),
      ).hide();
      renderUsersPage();
    } catch (error) {
      alert("حدث خطأ أثناء التعديل");
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  renderUsersPage();
});
