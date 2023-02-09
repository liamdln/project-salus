import { SettingsData } from "../model/settings";
import { Settings } from "../types/settings";

// export let settings: Settings = {
//     airport: {
//         name: "",
//         icao: "",
//         iata: ""
//     },
//     map: {
//         zoomLevel: 0,
//         xAxisCenter: 0,
//         yAxisCenter: 0,
//         circleRadius: 0
//     }
// }

export async function readSettings(returnFilter?: string) {

    return await SettingsData.find({}, returnFilter)
        .lean()
        .then((res: any) => {
            // settings = res;
            return res[0];
        }).catch(err => {
            console.log(err);
            throw new Error("Settings could not be read.");
        });

}

export function saveSettings(settings: Settings): Boolean {

    const allSettings = new SettingsData(settings);
    return allSettings.save((err: any) => {
        if (err) { return false; }
        return true;
    });

}
