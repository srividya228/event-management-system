document.getElementById("date").addEventListener("change", fetchSlots);

function fetchSlots() {
    const date = document.getElementById("date").value;
    if (!date) return;

    fetch(`http://localhost:5000/api/slots?date=${date}`)
        .then(response => response.json())
        .then(slots => {
            const timeSlotSelect = document.getElementById("timeSlot");
            timeSlotSelect.innerHTML = `<option value="">Select a Time Slot</option>`; // Reset options
            
            if (slots.length > 0) {
                slots.forEach(slot => {
                    const option = document.createElement("option");
                    option.value = slot;
                    option.textContent = slot;
                    timeSlotSelect.appendChild(option);
                });
            } else {
                timeSlotSelect.innerHTML = `<option value="" disabled>No slots available</option>`;
            }
        })
        .catch(error => console.error("Error fetching slots:", error));
}

function bookSlot() {
    const date = document.getElementById("date").value;
    const time = document.getElementById("timeSlot").value;
    const message = document.getElementById("message");

    if (!date || !time) {
        message.textContent = "Please select a date and time slot.";
        message.style.color = "red";
        return;
    }

    fetch("http://localhost:5000/api/book-slot", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ date, time })
    })
    .then(response => response.json())
    .then(data => {
        message.textContent = data.message;
        message.style.color = data.message.includes("successfully") ? "green" : "red";
        fetchSlots(); // Refresh available slots
    })
    .catch(() => {
        message.textContent = "Booking failed! Try again.";
        message.style.color = "red";
    });
}

// ✅ Logout button logic
document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();

            // Clear localStorage or sessionStorage
            localStorage.removeItem("authToken");
            sessionStorage.clear();

            // Redirect to login
            window.location.href = "log.html";
        });
    }
});
