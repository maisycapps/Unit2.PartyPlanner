// API ACCESS
const COHORT = "2407-FTB-ET-WEB-FT";
const EVENTS_API_URL =  `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
// const GUESTS_API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/guests`;
// const RSVPS_API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/rsvps`;

// STATE
const state = {
    events: [],
};

// EVENT UL
const eventList = document.querySelector("#eventList");

// ADD EVENT FORM SUBMISSION
const addEvent = document.querySelector("#event");
addEvent.addEventListener("submit", addNewEvent);

// SYNC STATE W API, RERENDER
async function reRender(){
    await getState();
    render();
}
reRender();


// UPDATE STATE from EVENTS API
async function getState(){
    try {
        const response = await fetch(EVENTS_API_URL, {
            method: "GET"
        });
        console.log(response);

        const json = await response.json();
        console.log(json)

        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
}
getState();

// new event card innerHTML: event name, date, time, location, description
async function addNewEvent(event) {
    event.preventDefault();

    await createEvent(
        addEvent.name.value,
        new Date(addEvent.date.value),
        addEvent.location.value,
        addEvent.description.value
    );
    console.log("Add Event clicked")
}

// CREATE NEW EVENT IN API, RERENDER
async function createEvent(name, date, location, description) {
    try {
        const response = await fetch(EVENTS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name, date, location, description})
        });
        const json = await response.json();
        console.log(json);
        reRender();
        } catch (error) {
        console.error(error);
    }
}

// DELETE FUNCTION
async function deleteEvent(id) {
    console.log(id);

    try {
        const response = await fetch(`${EVENTS_API_URL}/${id}`, {
            method: "DELETE"
        });
        console.log(response.status);

        if (!response.ok) {
            throw new Error("Event could not be deleted")
        }

        reRender();

    } catch (error) {
        console.error(error)
    }
}

// RENDER
function render() {
    if (!state.events.length) {
        eventList.innerHTML = `<li>No Events</li>`;
        return;
    }
    console.log("here")
    // render ul of lis: each event card
    const eventCards = state.events.map((event) => {
        const eventCard = document.createElement("li");
        eventCard.classList.add("event");
        eventCard.innerHTML = `
        <p><b>Name:</b> ${event.name}</p>
        <p><b>Date:</b> ${new Date(event.date).toLocaleDateString()}</p>
        <p><b>Location:</b> ${event.location}</p>
        <p><b>Description:</b> ${event.description}</p>
        `;

        // add delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Event";
        eventCard.append(deleteButton);

        // delete button event listener
        deleteButton.addEventListener("click", () => deleteEvent(event.id));

        return eventCard;
    });
    eventList.replaceChildren(...eventCards);
}
render();







