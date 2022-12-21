import { SettingsData } from "../model/settings";
import { Settings } from "../types/settings";

export var settings: Settings = {
    map: {
        zoomLevel: 15,
        xAxisCenter: 51.6,
        yAxisCenter: -4.1
    }
}

export async function readSettings(filter?: string): Promise<Settings> {

    return await SettingsData.find({}, filter).then((res: any) => {
        settings = res;
        return res;
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