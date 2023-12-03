const showEmailResult = async (e) => {
    e.preventDefault();
    const confirmation = document.getElementById("confirmation");
    let response = await getEmailResult();
    if (response.status == 200) {
        confirmation.innerHTML = "Thank you for reaching out!";
    } else {
        confirmation.innerHTML = "Sorry, your email was not sent.";
    }
};

const getEmailResult = async (e) => {
    const form = document.getElementById("contact-form");
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    const confirmation = document.getElementById("confirmation");
    confirmation.innerHTML = "Please wait...";

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: json,
        });
        return response;
    } catch (error) {
        console.log(error);
        document.getElementById("confirmation").innerHTML = "Sorry, your email was not sent.";
    }
};

document.getElementById("contact-form").onsubmit = showEmailResult;