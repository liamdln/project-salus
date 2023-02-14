import { Report } from "../types/reports";

export function getCardColourAndSeverity(report: Report) {
    let cardColour = "";
    let severity = "";
    switch (report.severity) {
        case 2:
            cardColour = "danger";
            severity = "Danger to Life";
            break;

        case 1:
            cardColour = "warning";
            severity = "Danger to Operations";
            break;

        case 0:
        default:
            cardColour = "primary";
            break;
    }
    return { cardColour, severity };
}

export function displayMessage(message: string, messageLimit: number) {
    if (message.length > messageLimit) {
        if (message.substring(messageLimit - 1, messageLimit) === " ") {
            const newMessage = message.substring(0, messageLimit - 1);
            return newMessage + "...";
        }
        return message.substring(0, messageLimit) + "...";
    } else {
        return message;
    }
}

export function getType(type: string) {
    if (type === "fod") {
        return "Foreign Object Debris"
    } else if (type === "wildlife") {
        return (
            "Wildlife"
        )
    } else {
        return ""
    }
}

export function getStatus(status: number, useDefaultColourAssignment?: boolean, customColour?: string) {
    // Status:
    // 0: Open
    // 1: In review
    // 2: Closed
    // 3: Archived
    // 4: Revoked
    // for custom colours: https://getbootstrap.com/docs/5.0/utilities/colors/
    switch (status) {
        case 4:
            if (useDefaultColourAssignment) {
                return { className: "text-secondary", content: "Revoked" }
            } else {
                return { className: `text-${customColour || "black"}`, content: "Revoked" }
            }
        case 3:
            if (useDefaultColourAssignment) {
                return { className: "text-secondary", content: "Archived" }
            } else {
                return { className: `text-${customColour || "black"}`, content: "Archived" }
            }

        case 2:
            if (useDefaultColourAssignment) {
                return { className: "text-success", content: "Closed" }
            } else {
                return { className: `text-${customColour || "black"}`, content: "Closed" }
            }

        case 1:
            if (useDefaultColourAssignment) {
                return { className: "text-warning", content: "In Review" }
            } else {
                return { className: `text-${customColour || "black"}`, content: "In Review" }
            }

        case 0:
        default:
            if (useDefaultColourAssignment) {
                return { className: "text-danger", content: "Open" }
            } else {
                return { className: `text-${customColour || "black"}`, content: "Open" }
            }

    }
}

