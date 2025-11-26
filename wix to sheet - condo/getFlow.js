// backend/getFlow.js

import wixCrmBackend from 'wix-crm-backend';

const trigger = {
    contact: {
        get: async function (email = "") {
            try {
                let contactInfo = { emails: [{ tag: "MAIN", email: email, primary: true }] };
                const result = await wixCrmBackend.contacts.appendOrCreateContact(contactInfo);
                return result.contactId || "";
            } catch (err) {
                return "";
            }
        },
        emailContact: async function (contactId = "", vars = {}) {
            try {
                const options = { variables: vars };
                await wixCrmBackend.triggeredEmails.emailContact("V2teC91", contactId, options);
                return true;
            } catch (err) {
                return false;
            }
        }
    },
    sendEmail: async function (email = "", vars = {}) {
        const contactId = await this.contact.get(email);
        if (!contactId) {
            return false;
        }

        // Default vars if none provided
        const defaultVars = {
            name1: email.split(/@/)[0],
            email1: email,
            phone1: "",
            contactPerson1: "",
            startDate1: "",
            endDate1: "",
            membersOption1: "",
            postalOrCity1: "",
        };

        const variables = Object.keys(vars).length ? vars : defaultVars;

        return await this.contact.emailContact(contactId, variables);
    }
};

export default trigger;