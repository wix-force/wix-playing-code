import wixWindow from 'wix-window';
import wixData from 'wix-data';
import * as run from 'backend/flow.jsw';

$w.onReady(async function () {
    const receivedID = wixWindow.lightbox.getContext();
    console.log("Received booking ID:", receivedID);

    if (!receivedID) return;

    let existingBooking;

    try {
        // ✅ Fetch the booking record
        existingBooking = await wixData.get("BookingsCollection", receivedID);

        // ✅ Load dropdown data BEFORE setting values
        await loadDropdownData();

        // ✅ Populate fields
        if (existingBooking) {
            $w("#userNameInput").value = existingBooking.userName || "";
            $w("#userEmailInput").value = existingBooking.userEmail || "";
            $w("#userPhoneInput").value = existingBooking.userPhone || "";
            $w("#bookingNameDropdown").value = existingBooking.bookingType || "";
            $w("#netNameDropdown").value = existingBooking.selectedNet || "";
            $w("#machineNameDropdown").value = existingBooking.selectedMachine || "";
            $w("#coachNameDropdown").value = existingBooking.selectedCoach || "";
            $w("#amountInput").value = existingBooking.amount || "";
            $w("#timeSlotDropdown").value = existingBooking.timeSlot || "";
            $w("#datePicker").value = existingBooking.date || null;
        }
    } catch (error) {
        console.error("Error fetching booking:", error);
    }

    // ✅ Save updates
    $w("#saveUpdateButton").onClick(async () => {
        try {
            const updatedBooking = {
                ...existingBooking,
                userName: $w("#userNameInput").value,
                userEmail: $w("#userEmailInput").value,
                userPhone: $w("#userPhoneInput").value,
                bookingType: $w("#bookingNameDropdown").value,
                selectedNet: $w("#netNameDropdown").value,
                selectedMachine: $w("#machineNameDropdown").value,
                selectedCoach: $w("#coachNameDropdown").value,
                amount: $w("#amountInput").value,
                timeSlot: $w("#timeSlotDropdown").value,
                date: $w("#datePicker").value
            };

            await wixData.update("BookingsCollection", updatedBooking);
            console.log("✅ Booking updated:", updatedBooking);

            // Full email JSON
            const emailData = {
                userName: updatedBooking.userName,
                userEmail: updatedBooking.userEmail,
                userPhone: updatedBooking.userPhone,
  
            };

            console.log('[Checkout] emailData to send to triggerOrderEmails:', emailData);

            await run.triggerOrderEmails(emailData);

            wixWindow.lightbox.close(updatedBooking);
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    });
});

// -------------------- Load Dropdown Data --------------------
async function loadDropdownData() {
    try {
        // Booking type dropdown (manual options)
        $w("#bookingNameDropdown").options = [
            { label: "Net Hire", value: "Net" },
            { label: "1-2-1 Coaching", value: "1-2-1 Coaching" }
        ];

        // Nets dropdown
        const nets = await wixData.query("NetsCollection").ascending("netID").find();
        $w("#netNameDropdown").options = nets.items.map(n => ({
            label: n.title || n.netName || `Net ${n.netID}`,
            value: n._id
        }));

        // Machines dropdown
        const machines = await wixData.query("BowlingMachinesCollection").ascending("machineID").find();
        $w("#machineNameDropdown").options = machines.items.map(m => ({
            label: m.title || m.machineName || `Machine ${m.machineID}`,
            value: m._id
        }));

        // Coaches dropdown
        const coaches = await wixData.query("CoachesCollection").ascending("coachID").find();
        $w("#coachNameDropdown").options = coaches.items.map(c => ({
            label: c.title || c.coachName || `Coach ${c.coachID}`,
            value: c._id
        }));

        // Time slot dropdown (fixed list)
        const timeSlots = [
            "09:30–10:30", "10:30–11:30", "11:30–12:30", "12:30–13:30",
            "13:30–14:30", "14:30–15:30", "15:30–16:30", "16:30–17:30",
            "17:30–18:30", "18:30–19:30", "19:30–20:30", "20:30–21:30"
        ];
        $w("#timeSlotDropdown").options = timeSlots.map(t => ({ label: t, value: t }));

    } catch (error) {
        console.error("Error loading dropdown data:", error);
    }
}