document.addEventListener('DOMContentLoaded', function() {
    const usersList = document.getElementById('usersList')
    const searchInput = document.getElementById('searchInput')
    const popup = document.getElementById('userPopup')
    const popupName = document.getElementById('popupName')
    const popupPhone = document.getElementById('popupPhone')
    const popupEmail = document.getElementById('popupEmail')
    const popupDate = document.getElementById('popupDate')
    const popupPosition = document.getElementById('popupPosition')
    const popupDepartment = document.getElementById('popupDepartment')
    const closeBtn = document.querySelector('.close')

    if (!usersList || !searchInput) {
        console.error('Элементы с идентификаторами usersList или searchInput не найдены')
        return
    }

    let usersData = []

    // функция загрузки данных с сервера
    async function fetchUsers() {
        try {
            const response = await fetch('/server/src/data/users.json')
            if (!response.ok) {
                throw new Error('Ошибка загрузки сети')
            }
            usersData = await response.json()
            displayUsers(usersData)
        } catch (error) {
            console.error('Возникла проблема с операцией fetch:', error)
            usersList.innerHTML = '<p>Не удалось загрузить данные пользователей</p>'
        }
    }

    // функция для отображения пользователей
    function displayUsers(users) {
        usersList.innerHTML = ''     // очистка контейнера перед добавлением карточек
        users.forEach(user => {
            const userCard = document.createElement('div')
            userCard.className = 'user-card'
            userCard.innerHTML = `
                <h2>${user.name}</h2>
                <div class="contact-info">
                    <img src="/public/images/phone.png" alt="Телефон" >
                    <a href="tel:${user.phone}" class="unstyled-link">${user.phone}</a>
                </div>
                <div class="email">
                    <img src="/public/images/email.png" alt="Почта" >
                    <a href="mailto:${user.email}" class="unstyled-link">${user.email}</a>
                </div>
            `
            userCard.addEventListener('click', () => openPopup(user))
            usersList.appendChild(userCard)
        })
    }

    // функция для показа окна pop-up
    function openPopup(user) {
        popupName.textContent = user.name
        popupPhone.textContent = user.phone
        popupEmail.textContent = user.email
        popupDate.textContent = user.hire_date 
        popupPosition.textContent = user.position_name 
        popupDepartment.textContent = user.department 
        popup.style.display = 'block'
    }

    function closePopup() {
        popup.style.display = 'none'
    }

    closeBtn.addEventListener('click', closePopup)

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup()
        }
    })

    // функция для фильтрации пользователей
    function filterUsers(searchItem) {
        const filterUsers = usersData.filter(user => 
            user.name.toLowerCase().includes(searchItem.toLowerCase()) ||
            user.phone.includes(searchItem) ||
            user.email.toLowerCase().includes(searchItem.toLowerCase())
        )
        displayUsers(filterUsers)
    }

    // обработчик события для инпута
    searchInput.addEventListener('input', function() {
        filterUsers(searchInput.value)
    })

    // загрузка пользователей при загрузке страницы
    fetchUsers()
})