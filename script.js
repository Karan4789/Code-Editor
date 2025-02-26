


require(["vs/editor/editor.main"], function () {
    monaco.editor.defineTheme("customTheme" ,{
        base: "vs-dark",  
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#120e25",  
            "editor.foreground": "#FFFFFF",  
            "editorCursor.foreground": "#FFFFFF",
        }
        });

    monaco.editor.setTheme("customTheme");  // Apply custom theme
});


// Function to update language dynamically
function updateLanguage() {
    const language = document.getElementById("language").value;
    monaco.editor.setModelLanguage(window.editor.getModel(), language);
}

// Add event listener for language selection
document.getElementById("language").addEventListener("change", updateLanguage);


monaco.editor.defineTheme("customTheme", {
    base: "vs-dark",  // Choose "vs" (light), "vs-dark" (dark), or "hc-black"
    inherit: true,
    rules: [
        // You can customize the editor's text and other UI elements here.
        // The background rule here is redundant as we define it directly under colors.
    ],
    colors: {
        "editor.background": "#120e25",  // Custom dark background color
        "editor.foreground": "#FFFFFF",  // White text color
        "editorCursor.foreground": "#FFFFFF"  // Cursor color for contrast
    }
});

// Apply the custom theme
monaco.editor.setTheme("customTheme");

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