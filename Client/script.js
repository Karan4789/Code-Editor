
document.getElementById("mode-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode"); // Toggle dark mode on body

    const isDarkMode = document.body.classList.contains("dark-mode");
    editor.updateOptions({ theme: isDarkMode ? "vs-light" : "vs-dark" }); 
});

/* Light and Dark Mode */ 

function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-content');
    dropdown.classList.toggle('active');
}

const modeToggle = document.getElementById("mode-toggle");
const body = document.body;

const savedMode = localStorage.getItem("theme");
if (savedMode) {
    body.classList.add(savedMode); // Apply saved mode (light or dark)
}


modeToggle.addEventListener("click", () => {
    if (body.classList.contains("light")) {
        // Switch to dark mode
        body.classList.remove("light");
        body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    } else {
        // Switch to light mode
        body.classList.remove("dark");
        body.classList.add("light");
        localStorage.setItem("theme", "light");
    }
});