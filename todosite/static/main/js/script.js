document.addEventListener('DOMContentLoaded', function () {
    const closeTaskBtn = document.getElementById('closeTaskBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const modalAuth = document.getElementById('modalAuth');
    const authBtn = document.getElementById('authBtn');
    const closeAuthBtn = document.getElementById('closeAuthBtn')
    const modalReg = document.getElementById('modalReg');
    const regBtn = document.getElementById('regBtn');
    const closeRegBtn = document.getElementById('closeRegBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    const editTaskBtns = document.querySelectorAll('.editTaskBtn');
    if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const response = await fetch(`/api-auth/logout/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            }
        });

        if (response.ok) {
            location.reload();
        } else {
            alert('Ошибка выхода из аккаунта');
        }
    });
    }

    if (authBtn) {
    authBtn.addEventListener("click", function () {
        modalAuth.style.display = "flex";
    });
    }

    closeAuthBtn.addEventListener("click", function () {
        modalAuth.style.display = "none";
    });

    regBtn.addEventListener("click", function () {
        modalReg.style.display = "flex";
        modalAuth.style.display = "none";
    });

    closeRegBtn.addEventListener("click", function () {
        modalReg.style.display = "none";
    });

    editTaskBtns.forEach((editTaskBtn) => {
        editTaskBtn.addEventListener('click', (e) => {
            const btn = e.target.classList.contains('editTaskBtn')
                ? e.target
                : e.target.closest('.editTaskBtn');

            const task = btn.closest('.task');
            const taskId = btn.dataset.id;

            const name = btn.textContent;
            const color = btn.dataset.color;
            const description = task.querySelector('.task-description').textContent.replace('Описание: ', '');
            const deadline = task.querySelector('.task-deadline').dataset.end;
            const statusElement = task.querySelector('.task-footer p, .task-footer-process p');
            const status = statusElement ? statusElement.textContent : 'В процессе';

            modalOverlay.querySelector('input[name="name"]').value = name;
            modalOverlay.querySelector('input[name="color"]').value = color;
            modalOverlay.querySelector('.task-header').style.backgroundColor = color;
            modalOverlay.querySelector('.task-header input[name="name"]').style.backgroundColor = color;
            modalOverlay.querySelector('textarea[name="description"]').value = description;
            modalOverlay.querySelector('input[name="end_date"]').value = deadline;
            modalOverlay.querySelector('select[name="status"]').value = status;
            modalOverlay.querySelector('input[name="task_id"]').value = taskId;


            const colorInput = modalOverlay.querySelector('input[name="color"]');
            colorInput.addEventListener('input', (e) => {
                modalOverlay.querySelector('.task-header').style.backgroundColor = e.target.value;
            });
            modalOverlay.style.display = 'flex';
        });
    });

    if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
        // Очищаем форму для новой задачи
        modalOverlay.querySelector('input[name="task_id"]').value = '';
        modalOverlay.querySelector('input[name="name"]').value = '';
        modalOverlay.querySelector('textarea[name="description"]').value = '';
        modalOverlay.querySelector('input[name="end_date"]').value = '';
        modalOverlay.querySelector('select[name="status"]').value = 'В процессе';
        modalOverlay.style.display = 'flex';
    });
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    document.querySelector('.save-task').addEventListener('click', async () => {
        const id = document.querySelector('input[name="task_id"]').value;
        const color = document.querySelector('input[name="color"]').value;
        const name = document.querySelector('input[name="name"]').value;
        const description = document.querySelector('textarea[name="description"]').value;
        const end_date = document.querySelector('input[name="end_date"]').value;
        const status = document.querySelector('select[name="status"]').value;
        const current_date = new Date();
        const start_date = `${current_date.getHours()}:${current_date.getMinutes()} ${current_date.getDate()}.${current_date.getMonth() + 1}.${current_date.getFullYear()}`;

        const response_userid = await fetch('/api/v1/users/get_user_id/', {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response_userid.json();
        const user = data.id;

        const payload = {
            name,
            description,
            status,
            start_date,
            end_date,
            color,
            user,
        };

        const method = id ? 'PATCH' : 'POST';
        const url = id ? `/api/v1/tasks/${id}/` : '/api/v1/tasks/';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
//            alert(id ? 'Задача обновлена!' : 'Задача создана!');
            location.reload();
            console.log(payload)
        } else {
            alert('Ошибка при сохранении задачи');
        }
    });

    document.querySelector('.delete-task').addEventListener('click', async () => {
        const id = document.querySelector('input[name="task_id"]').value;

        const response = await fetch(`/api/v1/tasks/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        });

        if (response.ok) {
//            alert('Задача удалена!');
            location.reload();
        } else {
            alert('Ошибка при удалении задачи');
        }
    });

    document.querySelector('.login-btn').addEventListener('click', async () => {
        const username = document.querySelector('#id_login_username').value;
        const password = document.querySelector('#id_login_password').value;

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch(`/api-auth/login/?next=/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken, // Убедись, что он есть
                },
                credentials: 'include', // очень важно для сессий
                body: formData,
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const text = await response.text();
                console.log('Ошибка входа:', text);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    });

    document.querySelector('.register-btn').addEventListener('click', async () => {
        const username = document.querySelector('#id_reg_username').value;
        const password = document.querySelector('#id_reg_password').value;
        const second_password = document.querySelector('#id_second_reg_password').value;

        if (password !== second_password) {
            const errorDiv = document.getElementById('reg-error');
            errorDiv.textContent = 'Пароли не совпадают!';
            errorDiv.style.display = 'block';
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        console.log(formData);

        try {
            const response = await fetch('/api/v1/users/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: formData,
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const text = await response.text();
                console.log('Ошибка регистрации:', text);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    });

    closeTaskBtn.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          modalOverlay.style.display = 'none';
        }
    });
});