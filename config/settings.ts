import dbConnect from "../lib/dbConnect";
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

    await dbConnect();
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

export async function saveSettings(id: any, settings: Settings) {
    await dbConnect();
    return await SettingsData.findByIdAndUpdate({ _id: id }, { $set: settings }, { new: true }).then((res: any) => {
        return res;
    }).catch((err) => {
        console.log(err);
        throw new Error("Could not save settings.")
    })

}
