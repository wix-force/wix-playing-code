import wixData from 'wix-data';

let selectedButtonId = "netHireButton"; // track selected button globally
let selectedTimeData = null;
let selectedDate;

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

$w.onReady(async function () {
    // -------------------- Button Toggle --------------------
    setSelectedButton("netHireButton");
    $w("#netHireButton").onClick(() => setSelectedButton("netHireButton"));
    $w("#oneToOneCoachingButton").onClick(() => setSelectedButton("oneToOneCoachingButton"));

    // -------------------- Date Picker Default Today --------------------
    const today = new Date();
    console.log("today: ", today)
    await loadAvailability(today);

    $w("#selectDatePicker").onChange(async () => {
        selectedDate = $w("#selectDatePicker").value;
        if (!selectedDate) return;
        // selectedTimeData = null; // Reset selection when date changes
        await loadAvailability(selectedDate);
    });

    // -------------------- Repeater Item Ready --------------------
    $w("#selectTimeRepeater").onItemReady(($item, itemData) => {
        $item("#selectTimeText").text = itemData.time;
        updateTimeBoxColor($item, itemData);

        if (itemData.available) {
            $item("#selectTimeBox").onClick(() => {
                selectedTimeData = itemData;
                $w("#selectTimeRepeater").forEachItem(($ri, riData) => {
                    updateTimeBoxColor($ri, riData);
                });
                updateTotal();
            });
        }
    });

    // -------------------- Add Machine Checkbox --------------------
    $w("#addMachineCheckbox").onChange(() => updateTotal());

    // -------------------- Book Now Button --------------------
    $w("#bookNowButton").onClick(async () => {
        selectedDate = $w("#selectDatePicker").value;
        const addMachine = $w("#addMachineCheckbox").checked;
        const bookingType = selectedButtonId === "netHireButton" ? "Net" : "1-2-1 Coaching";

        if (!selectedDate || !selectedTimeData) {
            showWarning("Please select a date and time!");
            return;
        }

        try {
            const totalAmount = parseFloat($w("#totalAmountText").text.replace("Price: £", ""));
            const userInfo = { name: "Test User", email: "test@example.com" };

            const booking = await createBooking(userInfo, bookingType, selectedDate, selectedTimeData.time, addMachine, totalAmount);

            console.log("✅ Booking completed:", booking._id);
            showWarning("✅ Booking completed.")

            // Auto-refresh availability immediately
            selectedTimeData = null; // Reset selection after booking
            await loadAvailability(selectedDate);
        } catch (err) {
            showWarning(err.message);
        }
    });

    // -------------------- Auto-refresh availability every 1 seconds --------------------
    setInterval(async () => {
        selectedDate = $w("#selectDatePicker").value;
        if (selectedDate) await loadAvailability(selectedDate);
    }, 1000);
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

// Helper function to color each time slot correctly
function updateTimeBoxColor($item, itemData) {
    if (!itemData.available) {
        $item("#selectTimeBox").style.backgroundColor = "#E0E0E0";
        $item("#selectTimeText").style.color = "#7D7D7D";
    } else if (selectedTimeData && selectedTimeData._id === itemData._id) {
        $item("#selectTimeBox").style.backgroundColor = "#007BFF";
        $item("#selectTimeText").style.color = "#FFFFFF";
    } else {
        $item("#selectTimeBox").style.backgroundColor = "#FFFFFF";
        $item("#selectTimeText").style.color = "#000000";
    }
}

// -------------------- AVAILABILITY --------------------
async function loadAvailability(selectedDate) {
    const bookings = await wixData.query("BookingsCollection")
        .eq("date", selectedDate)
        .find();

    // Count booked nets per slot
    const bookedNets = {};
    bookings.items.forEach(b => {
        if (b.selectedNet) bookedNets[b.timeSlot] = (bookedNets[b.timeSlot] || 0) + 1;
    });

    const updatedTimeData = timeDataTemplate.map(slot => {
        const booked = bookedNets[slot.time] || 0;
        return {
            ...slot,
            available: booked < 4 // 4 nets total
        };
    });

    // Reset selectedTimeData if previously selected slot is no longer available
    if (selectedTimeData) {
        const stillAvailable = updatedTimeData.find(t => t._id === selectedTimeData._id)?.available;
        if (!stillAvailable) selectedTimeData = null;
    }

    // Force repeater to refresh by clearing it first
    $w("#selectTimeRepeater").data = [];
    $w("#selectTimeRepeater").data = updatedTimeData;
}

// -------------------- AUTO-ASSIGN BOOKING --------------------
async function createBooking(userInfo, bookingType, date, timeSlot, addMachine, price) {
    const bookingsRes = await wixData.query("BookingsCollection")
        .eq("date", date)
        .eq("timeSlot", timeSlot)
        .find();

    const slotBookings = bookingsRes.items;

    // -------------------- Nets --------------------
    let selectedNet = null;
    if (bookingType === "Net" || bookingType === "1-2-1 Coaching") {
        const bookedNetIDs = slotBookings.map(b => b.selectedNet);
        const allNets = await wixData.query("NetsCollection").limit(4).ascending("netID").find();
        selectedNet = allNets.items.find(n => !bookedNetIDs.includes(n._id));
        if (!selectedNet) throw new Error("All nets are booked for this slot!");
    }

    // -------------------- Coaches --------------------
    let selectedCoach = null;
    if (bookingType === "1-2-1 Coaching") {
        // Check net availability first
        const bookedNetIDs = slotBookings.map(b => b.selectedNet);
        const allNets = await wixData.query("NetsCollection").limit(4).ascending("netID").find();
        const availableNet = allNets.items.find(n => !bookedNetIDs.includes(n._id));

        if (!availableNet) throw new Error("No nets available for this slot, so coaching can't be booked!");

        const bookedCoachIDs = slotBookings.map(b => b.selectedCoach);
        const allCoaches = await wixData.query("CoachesCollection").limit(4).ascending("coachID").find();
        selectedCoach = allCoaches.items.find(c => !bookedCoachIDs.includes(c._id));
        if (!selectedCoach) throw new Error("All coaches are booked for this slot!");
    }

    // -------------------- Machines --------------------
    let selectedMachine = null;
    if (addMachine) {
        const bookedMachineIDs = slotBookings.map(b => b.selectedMachine);
        const allMachines = await wixData.query("BowlingMachinesCollection").limit(2).ascending("machineID").find();
        selectedMachine = allMachines.items.find(m => !bookedMachineIDs.includes(m._id));
        if (!selectedMachine) throw new Error("All machines are booked for this slot!");
    }

    console.log("selectedDate: ", selectedDate)
    const newBooking = {
        bookingType,
        selectedNet: selectedNet ? selectedNet._id : null,
        selectedCoach: selectedCoach ? selectedCoach._id : null,
        selectedMachine: selectedMachine ? selectedMachine._id : null,
        date: selectedDate,
        timeSlot,
        userName: userInfo.name,
        userEmail: userInfo.email,
        amount: price,
        paymentStatus: "pending"
    };

    return await wixData.insert("BookingsCollection", newBooking);
}