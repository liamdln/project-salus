import axios from "axios";
import router from "next/router";
import Swal from "sweetalert2";
import { Settings } from "../../../types/settings";
import { User } from "next-auth";

export function saveSettings(e: any, settingsId: string) {
    e.preventDefault();
    const newSettings: Settings = {
        airport: {
            name: e.target["ad-name"].value,
            iata: e.target["iata-code"].value,
            icao: e.target["icao-code"].value
        },
        map: {
            zoomLevel: parseInt(e.target["zoom-level"].value),
            circleRadius: parseInt(e.target["range-ring-rad"].value),
            xAxisCenter: parseFloat(e.target["coords-lat"].value),
            yAxisCenter: parseFloat(e.target["coords-lng"].value)
        }
    }

    if (isNaN(newSettings.map.zoomLevel) ||
        isNaN(newSettings.map.circleRadius) ||
        isNaN(newSettings.map.xAxisCenter) ||
        isNaN(newSettings.map.yAxisCenter)) {

        Swal.fire({
            icon: "error",
            title: "That hasn't gone well!",
            text: "The settings you have entered do not match the expected types. Ensure you did not enter a letter or word where a number is expected.",
        })
        return false;
    }

    axios({
        method: "POST",
        url: `/api/settings`,
        data: { id: settingsId, payload: newSettings }
    }).then(() => {
        router.replace(router.asPath);
        Swal.fire({
            icon: "success",
            text: "Settings have been saved.",
        })
    }).catch((err) => {
        console.log(err)
        Swal.fire({
            icon: "error",
            title: "That hasn't gone well!",
            text: "The settings could not be saved. Please try again later, or contact the website administrator.",
            footer: "Error: Failed to POST."
        })
    })
    return false;
}

export function modifyUserEnabledStatus(user: User, enabled: boolean) {

    let message = "";
    if (enabled) {
        message = `Are you sure you want to enable ${user.name}?`
    } else {
        message = `Are you sure you want to disable ${user.name}?`
    }

    Swal.fire({
        title: message,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
    }).then((result) => {
        if (result.isConfirmed) {
            

            axios({
                method: "PATCH",
                url: `/api/users/${user._id}`,
                data: { userId: user._id, payload: { enabled } }
            }).then(() => {
                router.replace(router.asPath);
                Swal.fire({
                    icon: "success",
                    text: enabled ? "User has been enabled." : "User has been disabled.",
                })
            }).catch((err) => {
                console.log(err)
                Swal.fire({
                    icon: "error",
                    title: "That hasn't gone well!",
                    text: enabled ? "The user could not be enabled. Please try again later, or contact the website administrator" : "The user could not be disabled. Please try again later, or contact the website administrator",
                    footer: "Error: Failed to POST."
                })
            })
        }
    })
    return false;
}

export function editUser(user: User) {


    
}