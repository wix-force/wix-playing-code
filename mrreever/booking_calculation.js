import wixData from "wix-data";

$w.onReady(() => {
    // Promo Code Button
    $w("#applyPromoCodeButton").onClick(applyPromoCode);

    // Auto Calculate Cost on any relevant change
    $w("#numberOfPackageInput, #addPackageInput, #packageWeightInput, #deliverySpeedRadioGroup, #insuranceCheckbox, #promoCodeInput")
        .onChange(calculateCost);

    // Confirm Booking
    $w("#confirmBookingButton").onClick(confirmBooking);
});

// ---------------------------------------------
// GET FORM DATA
// ---------------------------------------------
function getFormData() {
    return {
        // SECTION 1: CONTACT INFO
        name: $w("#nameInput").value,
        company: $w("#companyInput").value,
        phoneNumber: $w("#phoneNumberInput").value,
        email: $w("#emailInput").value,

        // SECTION 2: PICKUP DETAILS
        contactPersonName: $w("#contactPersonNameInput").value,
        contactPersonPhoneNumber: $w("#contactPersonPhoneNumberInput").value,
        pickupStreetAddress: $w("#pickupStreetAddressInput").value,
        pickupCity: $w("#pickupCityInput").value,
        pickupState: $w("#pickupStateInput").value,
        pickupPostal: $w("#pickupPostalInput").value,
        pickupDate: $w("#pickupDate").value,
        pickupTime: $w("#pickupTime").value,

        // SECTION 3: DELIVERY DETAILS
        recipientPersonName: $w("#recipientPersonNameInput").value,
        recipientPersonPhoneNumber: $w("#recipientPersonPhoneNumberInput").value,
        deliveryStreetAddress: $w("#deliveryStreetAddressInput").value,
        deliveryCity: $w("#deliveryCityInput").value,
        deliveryState: $w("#deliveryStateInput").value,
        deliveryPostal: $w("#deliveryPostalInput").value,
        deliveryDate: $w("#deliveryDate").value,
        deliveryTime: $w("#deliveryTime").value,

        // SECTION 4: PACKAGE INFO
        numberOfPackage: Number($w("#numberOfPackageInput").value) || 0,
        extraPackages: Number($w("#addPackageInput").value) || 0,
        packageWeight: Number($w("#packageWeightInput").value) || 0,
        contentType: $w("#contentTypeDropdown").value,
        declaredValue: Number($w("#declaredValueInput").value) || 0,
        packageWidth: Number($w("#packageWidthInput").value) || 0,
        packageHeight: Number($w("#packageHeightInput").value) || 0,
        packageLength: Number($w("#packageLengthInput").value) || 0,

        // SECTION 5: PREFERENCES
        deliverySpeed: $w("#deliverySpeedRadioGroup").value, // "sameday" or "schedule"
        insurance: $w("#insuranceCheckbox").checked,
        signature: $w("#recipientSignatureCheckbox").checked,
        emailUpdate: $w("#emailUpdateCheckbox").checked,

        // SECTION 6: PROMO & TERMS
        promoCode: $w("#promoCodeInput").value,
        terms: $w("#termsCheckbox").checked,
    };
}

// ---------------------------------------------
// VALIDATE REQUIRED FIELDS
// ---------------------------------------------
function validateRequired(data) {
    // Contact Info
    if (!data.name) return "Customer Name is required";
    if (!data.phoneNumber) return "Mobile Number is required";
    if (!data.email) return "Email is required";

    // Pickup Details
    if (!data.contactPersonName) return "Pickup contact person name is required";
    if (!data.contactPersonPhoneNumber) return "Pickup contact person phone is required";
    if (!data.pickupStreetAddress) return "Pickup street address is required";
    if (!data.pickupCity) return "Pickup city is required";
    if (!data.pickupState) return "Pickup state is required";
    if (!data.pickupPostal) return "Pickup postal code is required";
    if (!data.pickupDate) return "Pickup date is required";
    if (!data.pickupTime) return "Pickup time is required";

    // Delivery Details
    if (!data.recipientPersonName) return "Recipient name is required";
    if (!data.recipientPersonPhoneNumber) return "Recipient phone is required";
    if (!data.deliveryStreetAddress) return "Delivery street address is required";
    if (!data.deliveryCity) return "Delivery city is required";
    if (!data.deliveryState) return "Delivery state is required";
    if (!data.deliveryPostal) return "Delivery postal code is required";
    if (!data.deliveryDate) return "Delivery date is required";
    if (!data.deliveryTime) return "Delivery time is required";

    // Package Info
    if (!data.numberOfPackage) return "Number of packages is required";
    if (!data.packageWeight) return "Package weight is required";
    if (!data.contentType) return "Content type is required";
    if (!data.declaredValue) return "Declared value is required";
    if (!data.packageWidth) return "Package width is required";
    if (!data.packageHeight) return "Package height is required";

    // Delivery Preferences
    if (!data.deliverySpeed) return "Delivery speed selection is required";

    // Terms
    if (!data.terms) return "You must accept terms & conditions";

    return null;
}

// ---------------------------------------------
// CALCULATE COST
// ---------------------------------------------
function calculateCost() {
    const data = getFormData();
    let cost = 0;

    // Delivery speed
    if (data.deliverySpeed) {
        const speed = data.deliverySpeed.toLowerCase();
        if (speed.includes("same")) cost += 40;
        else if (speed.includes("schedule")) cost += 30;
    }

    // Extra packages ($2 each)
    cost += data.extraPackages * 2;

    // Weight fee: $0.50 per lb over 25
    if (data.packageWeight > 25) {
        cost += (data.packageWeight - 25) * 0.5;
    }

    // Insurance ($5)
    if (data.insurance) cost += 5;

    // Apply promo discount if any
    let discount = 0;
    if ($w("#discountamountText").text) {
        discount = Number($w("#discountamountText").text.replace("$", "")) || 0;
        cost -= discount;
    }

    // Update UI
    $w("#estimatedCostText").text = "$" + cost.toFixed(2);
    $w("#totalCostText").text = "$" + cost.toFixed(2);
}

// ---------------------------------------------
// APPLY PROMO CODE
// ---------------------------------------------
function applyPromoCode() {
    const code = $w("#promoCodeInput").value.trim().toUpperCase();
    if (code !== "PROMO20") {
        $w("#discountamountText").text = "$0";
        $w("#discountText").show();
        $w("#discountText").text = "Invalid Promo Code!";
    } else {
        $w("#discountamountText").text = "$20";
        $w("#discountText").hide();
    }
    calculateCost();
}

// ---------------------------------------------
// CONFIRM BOOKING
// ---------------------------------------------
function confirmBooking() {
    const data = getFormData();

    // Validate required fields
    const error = validateRequired(data);
    if (error) {
        $w("#errorMessageText").text = error;
        $w("#errorMessageText").show();

        setTimeout(() => {
            $w("#errorMessageText").hide();
        }, 2000);
        return;
    }

    // SUCCESS → Log booking data
    console.log("Booking Data:", data);

    // Clear form
    clearForm();
}

// ---------------------------------------------
// CLEAR FORM
// ---------------------------------------------
function clearForm() {
    const fields = [
        "nameInput", "companyInput", "phoneNumberInput", "emailInput",
        "contactPersonNameInput", "contactPersonPhoneNumberInput",
        "pickupStreetAddressInput", "pickupCityInput", "pickupStateInput", "pickupPostalInput",
        "recipientPersonNameInput", "recipientPersonPhoneNumberInput",
        "deliveryStreetAddressInput", "deliveryCityInput", "deliveryStateInput", "deliveryPostalInput",
        "numberOfPackageInput", "addPackageInput", "packageWeightInput", "declaredValueInput",
        "packageWidthInput", "packageHeightInput", "packageLengthInput", "promoCodeInput"
    ];

    fields.forEach(id => $w(`#${id}`).value = "");

    // Reset checkboxes
    $w("#insuranceCheckbox").checked = false;
    $w("#recipientSignatureCheckbox").checked = false;
    $w("#emailUpdateCheckbox").checked = false;
    $w("#termsCheckbox").checked = false;

    // Reset dropdowns & radios
    $w("#contentTypeDropdown").value = "";
    $w("#deliverySpeedRadioGroup").value = "";

    // Reset date/time
    $w("#pickupDate").value = null;
    $w("#pickupTime").value = null;
    $w("#deliveryDate").value = null;
    $w("#deliveryTime").value = null;

    // Reset cost labels
    $w("#estimatedCostText").text = "$0";
    $w("#discountamountText").text = "";
    $w("#totalCostText").text = "$0";
    $w("#discountText").hide();
}
