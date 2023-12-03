// Navigation

const toggleNav = () => {
    document.getElementById("main-items").classList.toggle("hide-small");
};

// onload

window.onload = () => {
    document.getElementById("expand").onclick = toggleNav;
};