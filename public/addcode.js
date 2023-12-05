const getCodes =async() => {
    try {
        return (await fetch("api/codes")).json();
    } catch (error) {
        console.log(error);
    }
};

const showCode = async () => {
    const codeList = await getCodes();
    const codeDiv = document.getElementById("code-style");
    codeDiv.innerHTML = "";
    codeList.forEach((code) => {
        codeDiv.append(getCodeItem(code));
    });
};

const getCodeItem = (code) => {
    const div = document.createElement("div");

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    div.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    div.append(eLink);
    eLink.id = "edit-link";

    const h1 = document.createElement("h1");
    div.append(h1);
    h1.innerHTML = `Language: ${code.language}`;

    const img = document.createElement("img");
    div.append(img);
    img.src = code.img;

    const h3 = document.createElement("h3");
    div.append(h3);
    h3.innerHTML = "Description:";

    const p = document.createElement("p");
    div.append(p);
    p.innerHTML = code.description;

    const a = document.createElement("a");
    div.append(a);
    a.innerHTML = `<strong>Link</strong>`;
    a.href = code.link;

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-title").innerHTML = "Edit Code";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteCode(code);
    };

    populateEditForm(code);

    return div;
};

const deleteCode = async(code) => {
    let response = await fetch(`/api/codes/${code._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    if (response.status != 200) {
        console.log("error deleting");
        return;
    }

    let result = await response.json();
    showCode();
    resetForm();
};

const populateEditForm = (code) => {
    const form = document.getElementById("add-code-form");
    form._id.value = code._id;
    form.language.value = code.language;
    form.description.value = code.description;
    form.link.value = code.link;
};

const addEditSoda = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-code-form");
    const formData = new FormData(form);
    let response;
    
    if (form._id.value == -1) {
        formData.delete("_id");
        console.log(...formData);
        response = await fetch("/api/codes", {
            method: "POST",
            body: formData
        });
    } else {
        console.log(...formData);

        response = await fetch(`/api/codes/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }

    code = await response.json();

    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showCode();
};

const resetForm = () => {
    const form = document.getElementById("add-code-form");
    form.reset();
    form._id.value = "-1";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-title").innerHTML = "Add Code";
    resetForm();
};

showCode();
document.getElementById("add-code-form").onsubmit = addEditSoda;
document.getElementById("add-link").onclick = showHideAdd;

document.querySelector(".close").onclick = () => {
    document.querySelector(".dialog").classList.add("transparent");
};