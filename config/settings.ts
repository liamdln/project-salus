import { SettingsData } from "../model/settings";
import { Settings } from "../types/settings";

export var settings: Settings = {
    map: {
        zoomLevel: 0,
        xAxisCenter: 0,
        yAxisCenter: 0
    }
}

export async function readSettings(returnFilter?: string): Promise<Settings> {

    return await SettingsData.find({}, returnFilter).then((res: any) => {
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