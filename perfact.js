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

$w.onReady(async function () {
    // -------------------- Button Toggle --------------------
    setSelectedButton("netHireButton");
    $w("#netHireButton").onClick(() => setSelectedButton("netHireButton"));
    $w("#oneToOneCoachingButton").onClick(() => setSelectedButton("oneToOneCoachingButton"));

    // -------------------- Date Picker --------------------
    $w("#selectDatePicker").onChange(async () => {
        const selectedDate = $w("#selectDatePicker").value;
        if (!selectedDate) return;
        await loadAvailability(selectedDate);
    });

    // -------------------- Repeater Item Ready --------------------
    $w("#selectTimeRepeater").onItemReady(($item, itemData) => {
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

            await loadAvailability(selectedDate); // Refresh availability after booking
        } catch (err) {
            showWarning(err.message);
        }
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
    const bookings = await wixData.query("BookingsCollection")
        .eq("date", selectedDate)
        .find();

    // Count booked resources per slot
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

    $w("#selectTimeRepeater").data = updatedTimeData;
}

// -------------------- AUTO-ASSIGN BOOKING --------------------
async function createBooking(userInfo, bookingType, date, timeSlot, addMachine, price) {
    // Fetch existing bookings for this slot
    const bookingsRes = await wixData.query("BookingsCollection")
        .eq("date", date)
        .eq("timeSlot", timeSlot)
        .find();

    const slotBookings = bookingsRes.items;

    // -------------------- Nets --------------------
    let selectedNet = null;
    if (bookingType === "Net") {
        const bookedNetIDs = slotBookings.map(b => b.selectedNet);
        const allNets = await wixData.query("NetsCollection").limit(4).ascending("netID").find();
        selectedNet = allNets.items.find(n => !bookedNetIDs.includes(n._id));
    }

    // -------------------- Coaches --------------------
    let selectedCoach = null;
    if (bookingType === "1-2-1 Coaching") {
        const bookedCoachIDs = slotBookings.map(b => b.selectedCoach);
        const allCoaches = await wixData.query("CoachesCollection").limit(4).ascending("coachID").find();
        selectedCoach = allCoaches.items.find(c => !bookedCoachIDs.includes(c._id));
    }

    // -------------------- Machines --------------------
    let selectedMachine = null;
    if (addMachine) {
        const bookedMachineIDs = slotBookings.map(b => b.selectedMachine);
        const allMachines = await wixData.query("BowlingMachinesCollection").limit(2).ascending("machineID").find();
        selectedMachine = allMachines.items.find(m => !bookedMachineIDs.includes(m._id));
    }

    if (bookingType === "Net" && !selectedNet) throw new Error("All nets are booked for this slot!");
    if (bookingType === "1-2-1 Coaching" && !selectedCoach) throw new Error("All coaches are booked for this slot!");
    if (addMachine && !selectedMachine) throw new Error("All machines are booked for this slot!");

    const newBooking = {
        bookingType,
        selectedNet: selectedNet ? selectedNet._id : null,
        selectedCoach: selectedCoach ? selectedCoach._id : null,
        selectedMachine: selectedMachine ? selectedMachine._id : null,
        date,
        timeSlot,
        userName: userInfo.name,
        userEmail: userInfo.email,
        amount: price,
        paymentStatus: "pending"
    };

    return await wixData.insert("BookingsCollection", newBooking);
}
