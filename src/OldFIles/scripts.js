class FormHandler {
    constructor() {
        this.landingPage = document.getElementById("landingPage");
        this.form = document.getElementById("verificationForm");
        this.formTitle = document.getElementById("formTitle");
        this.autoFields = document.getElementById("autoFields");
        this.resCommFields = document.getElementById("resCommFields");
        this.ownerFields = document.getElementById("ownerFields");
        this.months = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];
        this.menu = document.getElementById("menu");
        this.hamburgerMenu = document.getElementById("hamburgerMenu");
        this.init();
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.createCalendar("today");
            this.createCalendar("birth");

            document.getElementById("todayDate").addEventListener("click", () => this.toggleCalendar("today"));
            document.getElementById("birthDate").addEventListener("click", () => this.toggleCalendar("birth"));

            this.hamburgerMenu.addEventListener("click", () => {
                this.menu.classList.toggle("hidden");
                this.hamburgerMenu.classList.toggle("active");
                this.hamburgerMenu.querySelector('.fa-times').classList.toggle('hidden');
            });

            this.menu.addEventListener("click", (event) => {
                if (event.target === this.menu || event.target.classList.contains('fa-times')) {
                    this.menu.classList.add("hidden");
                    this.hamburgerMenu.classList.remove("active");
                    this.hamburgerMenu.querySelector('.fa-times').classList.add('hidden');
                }
            });

            document.querySelectorAll('.menu ul li a').forEach(link => {
                link.addEventListener('click', () => {
                    this.menu.classList.add("hidden");
                    this.hamburgerMenu.classList.remove("active");
                    this.hamburgerMenu.querySelector('.fa-times').classList.add('hidden');
                });
            });
        });
    }

    showForm(type) {
        this.landingPage.style.display = "none";
        this.form.classList.remove("hidden");
        this.resetForm();

        this.formTitle.textContent = this.capitalizeFirstLetter(type);

        // Hide all fields initially
        document.querySelectorAll(".formGroup").forEach(group => group.classList.add("hidden"));

        // Show common fields
        document.getElementById("fullName").parentElement.classList.remove("hidden");
        document.getElementById("serviceAddress").parentElement.classList.remove("hidden");
        document.getElementById("homeAddress").parentElement.classList.remove("hidden");
        document.getElementById("phoneNumber").parentElement.classList.remove("hidden");
        document.getElementById("email").parentElement.classList.remove("hidden");
        document.getElementById("todayDate").parentElement.classList.remove("hidden");
        document.getElementById("birthDate").parentElement.classList.remove("hidden");
        document.getElementById("ownerType").parentElement.classList.remove("hidden");
        document.getElementById("id").parentElement.parentElement.classList.remove("hidden");
        document.getElementById("techId").parentElement.classList.remove("hidden");
        document.getElementById("ownerFullName").parentElement.classList.remove("hidden");
        document.getElementById("ownerAddress").parentElement.classList.remove("hidden");
        document.getElementById("ownerPhone").parentElement.classList.remove("hidden");
        document.getElementById("ownerEmail").parentElement.classList.remove("hidden");

        if (type === 'residential') {
            document.getElementById("propertyType").parentElement.classList.remove("hidden");
            document.getElementById("proofOfResidency").parentElement.parentElement.classList.remove("hidden");
        } else if (type === 'auto') {
            document.getElementById("aaaId").parentElement.classList.remove("hidden");
            document.getElementById("insurancePolicy").parentElement.classList.remove("hidden");
            document.getElementById("vin").parentElement.classList.remove("hidden");
            document.getElementById("registration").parentElement.parentElement.classList.remove("hidden");
            document.getElementById("licensePlate").parentElement.parentElement.classList.remove("hidden");
        } else if (type === 'commercial') {
            document.getElementById("propertyType").parentElement.classList.remove("hidden");
            document.getElementById("proofOfResidency").parentElement.parentElement.classList.remove("hidden");
        }

        this.toggleOwnerFields();
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    goBack() {
        this.landingPage.style.display = "block";
        this.form.classList.add("hidden");
        this.resetForm();
    }

    resetForm() {
        this.form.reset();
        document.querySelectorAll(".filePreview").forEach(preview => {
            preview.classList.add("hidden");
        });
    }

    createCalendar(type) {
        const calendar = document.getElementById(`${type}Calendar`);
        calendar.innerHTML = `
            <div class="calendarHeader">
                <span>
                    <select id="${type}Month" onchange="formHandler.updateCalendar('${type}')"></select>
                    <select id="${type}Year" onchange="formHandler.updateCalendar('${type}')"></select>
                </span>
            </div>
            <div class="calendarGrid" id="${type}Grid"></div>
        `;

        const monthSelect = document.getElementById(`${type}Month`);
        const yearSelect = document.getElementById(`${type}Year`);

        this.months.forEach((month, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
        });

        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= currentYear - 100; year--) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }

        const currentDate = new Date();
        monthSelect.value = currentDate.getMonth();
        yearSelect.value = currentYear;

        this.updateCalendar(type);
    }

    updateCalendar(type) {
        const monthSelect = document.getElementById(`${type}Month`);
        const yearSelect = document.getElementById(`${type}Year`);
        const grid = document.getElementById(`${type}Grid`);

        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        grid.innerHTML = "";

        for (let i = 0; i < firstDay.getDay(); i++) {
            grid.appendChild(document.createElement("div"));
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement("div");
            dayElement.textContent = day;
            dayElement.classList.add("calendarDay");
            dayElement.onclick = () => this.selectDate(type, year, month, day);
            grid.appendChild(dayElement);
        }
    }

    selectDate(type, year, month, day) {
        const input = document.getElementById(`${type}Date`);
        input.value = `${month + 1}/${day}/${year}`;
        this.toggleCalendar(type);
    }

    toggleCalendar(type) {
        const calendar = document.getElementById(`${type}Calendar`);
        calendar.classList.toggle("calendarHidden");
    }

    handleFileUpload(input) {
        const filePreview = input.nextElementSibling;
        const fileName = filePreview.querySelector(".fileName");

        if (input.files.length > 0) {
            fileName.textContent = input.files[0].name;
            filePreview.classList.remove("hidden");
        } else {
            filePreview.classList.add("hidden");
        }
    }

    clearFileInput(button) {
        const filePreview = button.parentElement;
        const fileInput = filePreview.previousElementSibling;

        fileInput.value = "";
        filePreview.classList.add("hidden");
    }

    toggleOwnerFields() {
        const ownerType = document.getElementById("ownerType").value;
        if (ownerType === "other") {
            document.getElementById("ownerFields").classList.remove("hidden");
        } else {
            document.getElementById("ownerFields").classList.add("hidden");
        }
    }
}

const formHandler = new FormHandler();