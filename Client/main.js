const USERS_URL = "http://localhost:3000/users";
const TASKS_URL = "http://localhost:3000/tasks";

const postData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); 
    } catch (error) {
        console.error('Error in postData:', error);
        throw error;
    }
};

const getData = async (url) => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error in getData:', error);
        throw error;
    }
};

const deleteData = async (url) => {
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error in deleteData:', error);
        throw error;
    }
};

async function renderTable() {
    try {
        const users = await getData(USERS_URL);
        const tasks = await getData(TASKS_URL);
        const tbody = document.getElementById('tasksTableBody');
        
        if (!tbody) return; 
        tbody.innerHTML = '';

        users.forEach(user => {
            // 1. استخدام == بدلاً من === لتجنب مشاكل (رقم مقابل نص)
            const userTask = tasks.find(task => task.userId == user.id);
            
            // 2. سطر تصحيح (Debug): افتح Console في المتصفح (F12) لترَ ما يتم العثور عليه
            console.log(`المستخدم: ${user.name} | المهمة المرتبطة به:`, userTask);

            const taskName = userTask ? userTask.taskName : '<span class="text-muted fst-italic">لا توجد مهام</span>';
            
            let statusBadge = '<span class="badge bg-secondary">-</span>';
            
            if (userTask && userTask.status) {
                // إزالة أي مسافات زائدة قد تسبب عدم المطابقة
                const status = userTask.status.trim().toLowerCase(); 
                
                if (status === 'completed') {
                    statusBadge = '<span class="badge bg-success">مكتملة</span>';
                } else if (status === 'in-progress') {
                    statusBadge = '<span class="badge bg-warning text-dark">قيد التنفيذ</span>';
                } else {
                    // أي حالة أخرى (بما فيها pending) ستظهر هنا
                    statusBadge = '<span class="badge bg-danger">لم تبدأ</span>';
                }
            }

            const row = `
                <tr>
                    <td><strong class="text-primary">#${user.id}</strong></td>
                    <td>${taskName}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width:30px; height:30px; font-size:14px;">
                                ${user.name.charAt(0)}
                            </div>
                            ${user.name}
                        </div>
                    </td>
                    <td>${statusBadge}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error("فشل في عرض الجدول:", error);
    }
}
document.getElementById('addUserForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const name = document.getElementById('userNameInput').value;
    const email = document.getElementById('userEmailInput').value;

    const newUser = {
        name: name,
        email: email
    };

    try {
        
        await postData(USERS_URL, newUser);

        const modalElement = document.getElementById('addUserModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        document.getElementById('addUserForm').reset();
        
        renderTable(); 

    } catch (error) {
        console.error("Error adding user:", error);
        alert("حدث خطأ أثناء إضافة المستخدم");
    }
});

document.addEventListener('DOMContentLoaded', renderTable);


async function loadUsersForTask() {
    try {
        const users = await getData(USERS_URL);
        const selectElement = document.getElementById('taskUserSelect');
        
        selectElement.innerHTML = '<option value="">-- اختر المستخدم --</option>';
        
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("فشل في تحميل المستخدمين للقائمة:", error);
    }
}

document.getElementById('addTaskForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const userId = parseInt(document.getElementById('taskUserSelect').value);
    const taskName = document.getElementById('taskNameInput').value;
    const status = document.getElementById('taskStatusSelect').value;

    const newTask = {
        userId: userId,
        taskName: taskName,
        status: status
    };

    try {
        await postData(TASKS_URL, newTask);

        const modalElement = document.getElementById('addTaskModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        document.getElementById('addTaskForm').reset();

        renderTable(); 

    } catch (error) {
        console.error("Error adding task:", error);
        alert("حدث خطأ أثناء إضافة المهمة");
    }
});