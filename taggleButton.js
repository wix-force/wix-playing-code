//v1 backend code in page code
$w.onReady(function () {
    // Initialize button styles
    setSelectedButton("netHireButton"); // default selected button

    // Event handlers
    $w("#netHireButton").onClick(() => setSelectedButton("netHireButton"));
    $w("#oneToOneCoachingButton").onClick(() => setSelectedButton("oneToOneCoachingButton"));
});

function setSelectedButton(selectedId) {
    const buttons = ["netHireButton", "oneToOneCoachingButton"];
    
    buttons.forEach(buttonId => {
        if (buttonId === selectedId) {
            $w(`#${buttonId}`).style.backgroundColor = "#007BFF"; // blue background
            $w(`#${buttonId}`).style.color = "#FFFFFF"; // white text
        } else {
            $w(`#${buttonId}`).style.backgroundColor = "#F9F9F9"; // gray background
            $w(`#${buttonId}`).style.color = "#000000"; // black text
        }
    });

    console.log(`${selectedId} is selected`);
}
// --------------------

// v2 time select repeater

$w.onReady(function () {
    // Hardcoded time slots with availability
    const timeData = [
        { "_id": "1", "time": "09:30", "available": true },
        { "_id": "2", "time": "10:30", "available": false },
        { "_id": "3", "time": "11:30", "available": true },
        { "_id": "4", "time": "12:30", "available": true },
        { "_id": "5", "time": "13:30", "available": false },
        { "_id": "6", "time": "14:30", "available": true },
        { "_id": "7", "time": "15:30", "available": true },
        { "_id": "8", "time": "16:30", "available": true },
        { "_id": "9", "time": "17:30", "available": true },
        { "_id": "10", "time": "18:30", "available": true },
        { "_id": "11", "time": "19:30", "available": true },
        { "_id": "12", "time": "20:30", "available": true },
    ];

    // Bind data to the repeater
    $w("#selectTimeRepeater").data = timeData;

    // Keep track of selected item
    let selectedIndex = null;

    // On item ready
    $w("#selectTimeRepeater").onItemReady(($item, itemData, index) => {
        // Set the time text
        $item("#selectTimeText").text = itemData.time;

        // Default styling based on availability
        if (!itemData.available) {
            $item("#selectTimeBox").style.backgroundColor = "#E0E0E0"; // gray background
            $item("#selectTimeText").style.color = "#7D7D7D"; // light black text
        } else {
            $item("#selectTimeBox").style.backgroundColor = "#FFFFFF"; // white background
            $item("#selectTimeText").style.color = "#000000"; // black text
        }

        // Click event for available slots only
        if (itemData.available) {
            $item("#selectTimeBox").onClick(() => {
                selectedIndex = index;

                // Refresh all items to update styles
                $w("#selectTimeRepeater").forEachItem(($ri, riData, riIndex) => {
                    if (!riData.available) {
                        // Unavailable style
                        $ri("#selectTimeBox").style.backgroundColor = "#E0E0E0";
                        $ri("#selectTimeText").style.color = "#7D7D7D";
                    } else if (riIndex === selectedIndex) {
                        // Selected style
                        $ri("#selectTimeBox").style.backgroundColor = "#007BFF"; // blue
                        $ri("#selectTimeText").style.color = "#FFFFFF"; // white
                    } else {
                        // Available but unselected
                        $ri("#selectTimeBox").style.backgroundColor = "#FFFFFF"; // white
                        $ri("#selectTimeText").style.color = "#000000"; // black
                    }
                });

                // Log selected time
                console.log("Selected time:", itemData.time);
            });
        }
    });
});

// -----------------------------------
//  v3 marge code 
// -------------------- Buttons Toggle --------------------
$w.onReady(function () {
    // Initialize button styles
    setSelectedButton("netHireButton"); // default selected button

    // Event handlers
    $w("#netHireButton").onClick(() => setSelectedButton("netHireButton"));
    $w("#oneToOneCoachingButton").onClick(() => setSelectedButton("oneToOneCoachingButton"));

    // -------------------- Time Slot Repeater --------------------
    // Hardcoded time slots with availability
    const timeData = [
        { "_id": "1", "time": "09:30", "available": true },
        { "_id": "2", "time": "10:30", "available": false },
        { "_id": "3", "time": "11:30", "available": true },
        { "_id": "4", "time": "12:30", "available": true },
        { "_id": "5", "time": "13:30", "available": false },
        { "_id": "6", "time": "14:30", "available": true },
        { "_id": "7", "time": "15:30", "available": true },
        { "_id": "8", "time": "16:30", "available": true },
        { "_id": "9", "time": "17:30", "available": true },
        { "_id": "10", "time": "18:30", "available": true },
        { "_id": "11", "time": "19:30", "available": true },
        { "_id": "12", "time": "20:30", "available": true },
    ];

    // Bind data to the repeater
    $w("#selectTimeRepeater").data = timeData;

    // Keep track of selected item
    let selectedIndex = null;

    // On item ready
    $w("#selectTimeRepeater").onItemReady(($item, itemData, index) => {
        // Set the time text
        $item("#selectTimeText").text = itemData.time;

        // Default styling based on availability
        if (!itemData.available) {
            $item("#selectTimeBox").style.backgroundColor = "#E0E0E0"; // gray background
            $item("#selectTimeText").style.color = "#7D7D7D";           // light black text
        } else {
            $item("#selectTimeBox").style.backgroundColor = "#FFFFFF"; // white background
            $item("#selectTimeText").style.color = "#000000";          // black text
        }

        // Click event for available slots only
        if (itemData.available) {
            $item("#selectTimeBox").onClick(() => {
                selectedIndex = index;

                // Refresh all items to update styles
                $w("#selectTimeRepeater").forEachItem(($ri, riData, riIndex) => {
                    if (!riData.available) {
                        // Unavailable style
                        $ri("#selectTimeBox").style.backgroundColor = "#E0E0E0";
                        $ri("#selectTimeText").style.color = "#7D7D7D";
                    } else if (riIndex === selectedIndex) {
                        // Selected style
                        $ri("#selectTimeBox").style.backgroundColor = "#007BFF"; // blue
                        $ri("#selectTimeText").style.color = "#FFFFFF";          // white
                    } else {
                        // Available but unselected
                        $ri("#selectTimeBox").style.backgroundColor = "#FFFFFF"; // white
                        $ri("#selectTimeText").style.color = "#000000";          // black
                    }
                });

                // Log selected time
                console.log("Selected time:", itemData.time);
            });
        }
    });
});

// -------------------- Functions --------------------
function setSelectedButton(selectedId) {
    const buttons = ["netHireButton", "oneToOneCoachingButton"];
    
    buttons.forEach(buttonId => {
        if (buttonId === selectedId) {
            $w(`#${buttonId}`).style.backgroundColor = "#007BFF"; // blue background
            $w(`#${buttonId}`).style.color = "#FFFFFF";           // white text
        } else {
            $w(`#${buttonId}`).style.backgroundColor = "#F9F9F9"; // gray background
            $w(`#${buttonId}`).style.color = "#000000";           // black text
        }
    });

    console.log(`${selectedId} is selected`);
}


// ----------------------------------------------------
// v4 console all data 

let selectedButtonId = "netHireButton"; // track selected button globally

$w.onReady(function () {
    // -------------------- Button Toggle --------------------
    setSelectedButton("netHireButton"); // default selected button
    $w("#netHireButton").onClick(() => setSelectedButton("netHireButton"));
    $w("#oneToOneCoachingButton").onClick(() => setSelectedButton("oneToOneCoachingButton"));

    // -------------------- Time Slot Repeater --------------------
    const timeData = [
        { "_id": "1", "time": "09:30", "available": true },
        { "_id": "2", "time": "10:30", "available": false },
        { "_id": "3", "time": "11:30", "available": true },
        { "_id": "4", "time": "12:30", "available": true },
        { "_id": "5", "time": "13:30", "available": false },
        { "_id": "6", "time": "14:30", "available": true },
        { "_id": "7", "time": "15:30", "available": true },
        { "_id": "8", "time": "16:30", "available": true },
        { "_id": "9", "time": "17:30", "available": true },
        { "_id": "10", "time": "18:30", "available": true },
        { "_id": "11", "time": "19:30", "available": true },
        { "_id": "12", "time": "20:30", "available": true },
    ];

    $w("#selectTimeRepeater").data = timeData;

    let selectedIndex = null;
    let selectedTimeData = null;

    function updateTotal() {
        if (!selectedTimeData) {
            $w("#totalAmountText").text = "Price: £0";
            return;
        }

        const time = selectedTimeData.time;
        let baseAmount = 0;

        if (time >= "09:30" && time < "16:30") {
            baseAmount = 20;
        } else {
            baseAmount = 30;
        }

        const addMachine = $w("#addMachineCheckbox").checked;
        const total = baseAmount + (addMachine ? 5 : 0);

        $w("#totalAmountText").text = `Price: £${total}`;
    }

    $w("#addMachineCheckbox").onChange(() => updateTotal());

    $w("#selectTimeRepeater").onItemReady(($item, itemData, index) => {
        $item("#selectTimeText").text = itemData.time;

        if (!itemData.available) {
            $item("#selectTimeBox").style.backgroundColor = "#E0E0E0";
            $item("#selectTimeText").style.color = "#7D7D7D";
        } else {
            $item("#selectTimeBox").style.backgroundColor = "#FFFFFF";
            $item("#selectTimeText").style.color = "#000000";
        }

        if (itemData.available) {
            $item("#selectTimeBox").onClick(() => {
                selectedIndex = index;
                selectedTimeData = itemData;

                $w("#selectTimeRepeater").forEachItem(($ri, riData, riIndex) => {
                    if (!riData.available) {
                        $ri("#selectTimeBox").style.backgroundColor = "#E0E0E0";
                        $ri("#selectTimeText").style.color = "#7D7D7D";
                    } else if (riIndex === selectedIndex) {
                        $ri("#selectTimeBox").style.backgroundColor = "#007BFF";
                        $ri("#selectTimeText").style.color = "#FFFFFF";
                    } else {
                        $ri("#selectTimeBox").style.backgroundColor = "#FFFFFF";
                        $ri("#selectTimeText").style.color = "#000000";
                    }
                });

                updateTotal();
            });
        }
    });

    // -------------------- Book Now Button --------------------
    $w("#bookNowButton").onClick(() => {
        // Check if required fields are selected
        const selectedDate = $w("#selectDatePicker").value;
        if (!selectedTimeData || !selectedDate) {
			console.log(`Not is selected`);
            // Show warning text in red for 2 seconds
            // $w("#warningText").text = "Please select a date and time!";
            // $w("#warningText").style.color = "red";
            // $w("#warningText").show();
            // setTimeout(() => {
            //     $w("#warningText").hide();
            // }, 2000);
            return;
        }

        const addMachine = $w("#addMachineCheckbox").checked;
        const totalAmount = $w("#totalAmountText").text;

        console.log({
            selectedButtonId,
            selectedDate,
            addMachine,
            selectedTime: selectedTimeData.time,
            totalAmount
        });
    });
});

// -------------------- Functions --------------------
function setSelectedButton(selectedId) {
    selectedButtonId = selectedId; // update global selected button

    const buttons = ["netHireButton", "oneToOneCoachingButton"];
    buttons.forEach(buttonId => {
        if (buttonId === selectedId) {
            $w(`#${buttonId}`).style.backgroundColor = "#007BFF";
            $w(`#${buttonId}`).style.color = "#FFFFFF";
        } else {
            $w(`#${buttonId}`).style.backgroundColor = "#F9F9F9";
            $w(`#${buttonId}`).style.color = "#000000";
        }
    });

    console.log(`${selectedId} is selected`);
}

// ----------------------------------------------------
// v5 logic
import wixData from 'wix-data';

let selectedButtonId = "netHireButton"; // Track selected booking type globally
let selectedTimeData = null;

// -------------------- ON READY --------------------
$w.onReady(function () {
    // -------------------- Button Toggle --------------------
    setSelectedButton("netHireButton");
    $w("#netHireButton").onClick(() => setSelectedButton("netHireButton"));
    $w("#oneToOneCoachingButton").onClick(() => setSelectedButton("oneToOneCoachingButton"));

    // -------------------- Time Slot Repeater --------------------
    const timeData = [
        { "_id": "1", "time": "09:30", "available": true },
        { "_id": "2", "time": "10:30", "available": true },
        { "_id": "3", "time": "11:30", "available": true },
        { "_id": "4", "time": "12:30", "available": true },
        { "_id": "5", "time": "13:30", "available": true },
        { "_id": "6", "time": "14:30", "available": true },
        { "_id": "7", "time": "15:30", "available": true },
        { "_id": "8", "time": "16:30", "available": true },
        { "_id": "9", "time": "17:30", "available": true },
        { "_id": "10", "time": "18:30", "available": true },
        { "_id": "11", "time": "19:30", "available": true },
        { "_id": "12", "time": "20:30", "available": true },
    ];

    $w("#selectTimeRepeater").data = timeData;

    let selectedIndex = null;

    function updateTotal() {
        if (!selectedTimeData) {
            $w("#totalAmountText").text = "Price: £0";
            return;
        }

        const time = selectedTimeData.time.split("–")[0];
        let baseAmount = (time >= "09:30" && time < "16:30") ? 20 : 30;
        const addMachine = $w("#addMachineCheckbox").checked;
        const total = baseAmount + (addMachine ? 5 : 0);

        $w("#totalAmountText").text = `Price: £${total}`;
    }

    $w("#addMachineCheckbox").onChange(() => updateTotal());

    $w("#selectTimeRepeater").onItemReady(($item, itemData, index) => {
        $item("#selectTimeText").text = itemData.time;

        // Style unavailable slots
        if (!itemData.available) {
            $item("#selectTimeBox").style.backgroundColor = "#E0E0E0";
            $item("#selectTimeText").style.color = "#7D7D7D";
            return;
        }

        // Handle click selection
        $item("#selectTimeBox").onClick(() => {
            selectedIndex = index;
            selectedTimeData = itemData;

            $w("#selectTimeRepeater").forEachItem(($ri, riData, riIndex) => {
                if (!riData.available) {
                    $ri("#selectTimeBox").style.backgroundColor = "#E0E0E0";
                    $ri("#selectTimeText").style.color = "#7D7D7D";
                } else if (riIndex === selectedIndex) {
                    $ri("#selectTimeBox").style.backgroundColor = "#007BFF";
                    $ri("#selectTimeText").style.color = "#FFFFFF";
                } else {
                    $ri("#selectTimeBox").style.backgroundColor = "#FFFFFF";
                    $ri("#selectTimeText").style.color = "#000000";
                }
            });

            updateTotal();
        });
    });

    // -------------------- Book Now --------------------
    $w("#bookNowButton").onClick(async () => {
        const selectedDate = $w("#selectDatePicker").value;
        const addMachine = $w("#addMachineCheckbox").checked;

        // Validation check
        if (!selectedDate || !selectedTimeData) {
            showWarning("Please select a date and time!");
            return;
        }

        // Check net availability
        const availableNets = await getAvailableNets(selectedDate, selectedTimeData.time);
        if (availableNets.length === 0) {
            showWarning("No nets available at this time!");
            return;
        }

        const selectedNet = availableNets[0]; // Pick first available net
        const selectedCoach = null; // For 1-2-1 you’ll later query available coach
        const selectedMachine = addMachine ? await getAvailableMachine() : null;

        const totalAmount = parseFloat($w("#totalAmountText").text.replace("Price: £", ""));

        // Dummy user info (replace with wixUsers.currentUser if needed)
        const userInfo = {
            name: "Test User",
            email: "test@example.com"
        };

        // Create booking
        await createBooking(
            userInfo,
            selectedButtonId === "netHireButton" ? "Net" : "1-2-1 Coaching",
            selectedNet,
            selectedCoach,
            selectedMachine,
            addMachine,
            selectedDate,
            selectedTimeData.time,
            totalAmount
        );

        console.log("✅ Booking completed!");
    });
});

// -------------------- FUNCTIONS --------------------

function setSelectedButton(selectedId) {
    selectedButtonId = selectedId;

    const buttons = ["netHireButton", "oneToOneCoachingButton"];
    buttons.forEach(buttonId => {
        if (buttonId === selectedId) {
            $w(`#${buttonId}`).style.backgroundColor = "#007BFF";
            $w(`#${buttonId}`).style.color = "#FFFFFF";
        } else {
            $w(`#${buttonId}`).style.backgroundColor = "#F9F9F9";
            $w(`#${buttonId}`).style.color = "#000000";
        }
    });
    console.log(`${selectedId} selected`);
}

function showWarning(message) {
    $w("#warningText").text = message;
    $w("#warningText").style.color = "red";
    $w("#warningText").show();
    setTimeout(() => $w("#warningText").hide(), 2000);
}

// -------------------- DATA QUERIES --------------------

// Find available nets for given date/time
export function getAvailableNets(selectedDate, selectedTime) {
    return wixData.query("NetsCollection")
        .eq("date", selectedDate)
        .eq("timeSlot", selectedTime)
        .eq("status", "available")
        .find()
        .then(res => res.items);
}

// Get first available machine (if user added one)
export function getAvailableMachine() {
    return wixData.query("BowlingMachinesCollection")
        .eq("status", "available")
        .find()
        .then(res => res.items.length ? res.items[0] : null);
}

// Create booking and update statuses
export function createBooking(userInfo, bookingType, selectedNet, selectedCoach, selectedMachine, machineSelected, date, timeSlot, price) {
    const newBooking = {
        bookingType,
        selectedNet,
        selectedCoach,
        selectedMachine: machineSelected ? selectedMachine : null,
        date,
        timeSlot,
        userName: userInfo.name,
        userEmail: userInfo.email,
        price,
        paymentStatus: "pending"
    };

    return wixData.insert("BookingsCollection", newBooking)
        .then((booking) => {
            // Update resources
            updateResourceStatus(selectedNet, selectedCoach, selectedMachine, booking._id, date, timeSlot);
            return booking;
        });
}

// Update all resource statuses after booking
function updateResourceStatus(net, coach, machine, bookingID, date, timeSlot) {
    // Nets
    if (net) {
        wixData.update("NetsCollection", {
            ...net,
            status: "booked",
            bookingID,
            date,
            timeSlot
        });
    }

    // Coach
    if (coach) {
        wixData.update("CoachesCollection", {
            ...coach,
            status: "booked",
            bookingID,
            date,
            timeSlot
        });
    }

    // Bowling Machine
    if (machine) {
        wixData.update("BowlingMachinesCollection", {
            ...machine,
            status: "booked",
            bookingID,
            date,
            timeSlot
        });
    }
}
=============================


import wixData from 'wix-data';

let selectedButtonId = "netHireButton"; // track selected button globally
let selectedTimeData = null;

// -------------------- Time Slots Template --------------------
const timeDataTemplate = [
    { "_id": "1", "time": "09:30–10:30", "available": true },
    { "_id": "2", "time": "10:30–11:30", "available": true },
    { "_id": "3", "time": "11:30–12:30", "available": true },
    { "_id": "4", "time": "12:30–13:30", "available": true },
    { "_id": "5", "time": "13:30–14:30", "available": true },
    { "_id": "6", "time": "14:30–15:30", "available": true },
    { "_id": "7", "time": "15:30–16:30", "available": true },
    { "_id": "8", "time": "16:30–17:30", "available": true },
    { "_id": "9", "time": "17:30–18:30", "available": true },
    { "_id": "10", "time": "18:30–19:30", "available": true },
    { "_id": "11", "time": "19:30–20:30", "available": true },
    { "_id": "12", "time": "20:30–21:30", "available": true },
];

$w.onReady(function () {
    // -------------------- Button Toggle --------------------
    setSelectedButton("netHireButton");
    $w("#netHireButton").onClick(() => setSelectedButton("netHireButton"));
    $w("#oneToOneCoachingButton").onClick(() => setSelectedButton("oneToOneCoachingButton"));

    // -------------------- Date Picker --------------------
    $w("#selectDatePicker").onChange(async () => {
        const selectedDate = $w("#selectDatePicker").value;
        if (!selectedDate) return;

        console.log("Selected date:", selectedDate);

        // Load availability from BookingCollection
        await loadAvailability(selectedDate);
    });

    // -------------------- Repeater Item Ready --------------------
    $w("#selectTimeRepeater").onItemReady(($item, itemData, index) => {
        $item("#selectTimeText").text = itemData.time;

        if (!itemData.available) {
            $item("#selectTimeBox").style.backgroundColor = "#E0E0E0";
            $item("#selectTimeText").style.color = "#7D7D7D";
            return;
        }

        $item("#selectTimeBox").onClick(() => {
            selectedTimeData = itemData;

            $w("#selectTimeRepeater").forEachItem(($ri, riData) => {
                if (!riData.available) {
                    $ri("#selectTimeBox").style.backgroundColor = "#E0E0E0";
                    $ri("#selectTimeText").style.color = "#7D7D7D";
                } else if (riData._id === itemData._id) {
                    $ri("#selectTimeBox").style.backgroundColor = "#007BFF";
                    $ri("#selectTimeText").style.color = "#FFFFFF";
                } else {
                    $ri("#selectTimeBox").style.backgroundColor = "#FFFFFF";
                    $ri("#selectTimeText").style.color = "#000000";
                }
            });

            updateTotal();
        });
    });

    // -------------------- Add Machine Checkbox --------------------
    $w("#addMachineCheckbox").onChange(() => updateTotal());

    // -------------------- Book Now Button --------------------
    $w("#bookNowButton").onClick(async () => {
        const selectedDate = $w("#selectDatePicker").value;
        const addMachine = $w("#addMachineCheckbox").checked;

        if (!selectedDate || !selectedTimeData) {
            showWarning("Please select a date and time!");
            return;
        }

        // Check nets availability again before booking
        const availableNets = await getAvailableNets(selectedDate, selectedTimeData.time);
        if (availableNets.length === 0) {
            showWarning("No nets available at this time!");
            return;
        }

        const selectedNet = availableNets[0];
        const selectedCoach = null; // For coaching
        const selectedMachine = addMachine ? await getAvailableMachine() : null;

        const totalAmount = parseFloat($w("#totalAmountText").text.replace("Price: £", ""));

        const userInfo = { name: "Test User", email: "test@example.com" };

        await createBooking(
            userInfo,
            selectedButtonId === "netHireButton" ? "Net" : "1-2-1 Coaching",
            selectedNet,
            selectedCoach,
            selectedMachine,
            addMachine,
            selectedDate,
            selectedTimeData.time,
            totalAmount
        );

        console.log("✅ Booking completed!");
        await loadAvailability(selectedDate); // Refresh availability after booking
    });

});

// -------------------- FUNCTIONS --------------------

function setSelectedButton(selectedId) {
    selectedButtonId = selectedId;
    const buttons = ["netHireButton", "oneToOneCoachingButton"];
    buttons.forEach(buttonId => {
        if (buttonId === selectedId) {
            $w(`#${buttonId}`).style.backgroundColor = "#007BFF";
            $w(`#${buttonId}`).style.color = "#FFFFFF";
        } else {
            $w(`#${buttonId}`).style.backgroundColor = "#F9F9F9";
            $w(`#${buttonId}`).style.color = "#000000";
        }
    });
    console.log(`${selectedId} selected`);
}

function showWarning(message) {
    $w("#warningText").text = message;
    $w("#warningText").style.color = "red";
    $w("#warningText").show();
    setTimeout(() => $w("#warningText").hide(), 2000);
}

function updateTotal() {
    if (!selectedTimeData) {
        $w("#totalAmountText").text = "Price: £0";
        return;
    }
    const time = selectedTimeData.time.split("–")[0];
    let baseAmount = (time >= "09:30" && time < "16:30") ? 20 : 30;
    const addMachine = $w("#addMachineCheckbox").checked;
    const total = baseAmount + (addMachine ? 5 : 0);
    $w("#totalAmountText").text = `Price: £${total}`;
}

// -------------------- AVAILABILITY --------------------
async function loadAvailability(selectedDate) {
    console.log("Loading availability for date:", selectedDate);

    const result = await wixData.query("BookingsCollection")
        .eq("date", selectedDate)
        .find();

    const bookedCount = {};
    result.items.forEach(booking => {
        const slot = booking.timeSlot;
        bookedCount[slot] = (bookedCount[slot] || 0) + 1;
    });

    const totalNets = 4;

    const updatedTimeData = timeDataTemplate.map(slot => {
        const booked = bookedCount[slot.time] || 0;
        return {
            ...slot,
            available: booked < totalNets
        };
    });

    $w("#selectTimeRepeater").data = updatedTimeData;
    console.log("Updated slot availability:", updatedTimeData);
}

// -------------------- DATA QUERIES --------------------
export function getAvailableNets(selectedDate, selectedTime) {
    return wixData.query("BookingsCollection")
        .eq("date", selectedDate)
        .eq("timeSlot", selectedTime)
        .find()
        .then(res => {
            const bookedNets = res.items.length;
            const totalNets = 4;
            const freeNets = totalNets - bookedNets;
            if (freeNets > 0) {
                return Array(freeNets).fill({}); // return dummy array for each available net
            }
            return [];
        });
}

export function getAvailableMachine() {
    return wixData.query("BowlingMachinesCollection")
        .eq("status", "available")
        .find()
        .then(res => res.items.length ? res.items[0] : null);
}

export function createBooking(userInfo, bookingType, selectedNet, selectedCoach, selectedMachine, machineSelected, date, timeSlot, price) {
    const newBooking = {
        bookingType,
        selectedNet,
        selectedCoach,
        selectedMachine: machineSelected ? selectedMachine : null,
        date,
        timeSlot,
        userName: userInfo.name,
        userEmail: userInfo.email,
        amount: price,
        paymentStatus: "pending"
    };

    return wixData.insert("BookingsCollection", newBooking)
        .then(booking => {
            console.log("Booking saved:", booking._id);
            return booking;
        });
}