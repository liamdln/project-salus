import dbConnect from "./dbConnect";
import { SettingsData } from "../model/settings";
import { Settings } from "../types/settings";

export async function readSettings(returnFilter?: string) {

    await dbConnect();
    return await SettingsData.find({}, returnFilter)
        .lean()
        .then((res: any) => {
            // settings = res;
            return res[0];
        }).catch(err => {
            console.error(err);
            throw new Error("Settings could not be read.");
        });

}

export async function saveSettings(id: any, settings: Settings) {
    await dbConnect();
    return await SettingsData.findByIdAndUpdate({ _id: id }, { $set: settings }, { new: true }).then((res: any) => {
        return res;
    }).catch((err) => {
        console.error(err);
        throw new Error("Could not save settings.")
    })

}
