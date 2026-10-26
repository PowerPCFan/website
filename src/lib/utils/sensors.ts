export const CO2_THRESHOLDS: Thresholds = {
    "300": {
        label: "Great",
        emoji: "🔵",
        color: "text-blue-500",
    },
    "600": {
        label: "Good",
        emoji: "🟢",
        color: "text-green-500",
    },
    "900": {
        label: "OK",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "1100": {
        label: "Suboptimal",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "1300": {
        label: "Bad",
        emoji: "🔴",
        color: "text-red-500",
    },
    "1800": {
        label: "Very bad",
        emoji: "🟣",
        color: "text-purple-500",
    },
}

export const INDOOR_TEMP_THRESHOLDS: Thresholds = {
    "64": {
        label: "Cold",
        emoji: "🔵",
        color: "text-blue-500",
    },
    "67": {
        label: "Optimal",
        emoji: "🟢",
        color: "text-green-500",
    },
    "73": {
        label: "Warm",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "76": {
        label: "Hot",
        emoji: "🔴",
        color: "text-red-500",
    },
}

export const HUMIDITY_THRESHOLDS: Thresholds = {
    "0": {
        label: "Extremely dry",
        emoji: "🔴",
        color: "text-red-500",
    },
    "20": {
        label: "Too dry",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "35": {
        label: "Optimal",
        emoji: "🟢",
        color: "text-green-500",
    },
    "60": {
        label: "Too damp",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "80": {
        label: "Extremely damp",
        emoji: "🔴",
        color: "text-red-500",
    },
}

export const RESISTANCE_THRESHOLDS: Thresholds = {
    "10": {
        label: "Very Bad",
        emoji: "🔴",
        color: "text-red-500",
    },
    "50": {
        label: "Poor",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "150": {
        label: "OK",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "300": {
        label: "Good",
        emoji: "🟢",
        color: "text-green-500",
    },
    "1000": {
        label: "Excellent",
        emoji: "🔵",
        color: "text-blue-500",
    },
}

export const PM25_THRESHOLDS: Thresholds = {
    "0": {
        label: "Excellent",
        emoji: "🔵",
        color: "text-blue-500",
    },
    "6": {
        label: "Good",
        emoji: "🟢",
        color: "text-green-500",
    },
    "12": {
        label: "OK",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "35": {
        label: "Unhealthy",
        emoji: "🔴",
        color: "text-red-500",
    },
    "60": {
        label: "Very unhealthy",
        emoji: "🟣",
        color: "text-purple-500",
    },
}

export const PM100_THRESHOLDS: Thresholds = {
    "0": {
        label: "Excellent",
        emoji: "🔵",
        color: "text-blue-500",
    },
    "12": {
        label: "Good",
        emoji: "🟢",
        color: "text-green-500",
    },
    "24": {
        label: "OK",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "75": {
        label: "Unhealthy",
        emoji: "🔴",
        color: "text-red-500",
    },
    "120": {
        label: "Very unhealthy",
        emoji: "🟣",
        color: "text-purple-500",
    },
}

export const OUTDOOR_TEMP_THRESHOLDS: Thresholds = {
    "-100": {
        label: "Frigid",
        emoji: "🟣",
        color: "text-purple-500",
    },
    "15": {
        label: "Very cold",
        emoji: "🔴",
        color: "text-red-500",
    },
    "30": {
        label: "Cold",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "45": {
        label: "Chilly",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "60": {
        label: "Comfortable",
        emoji: "🟢",
        color: "text-green-500",
    },
    "75": {
        label: "Warm",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "80": {
        label: "Hot",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "85": {
        label: "Very hot",
        emoji: "🔴",
        color: "text-red-500",
    },
    "95": {
        label: "Scorching hot",
        emoji: "🟣",
        color: "text-purple-500",
    },
}

export const OUTDOOR_HUMIDITY_THRESHOLDS: Thresholds = {
    "0": {
        label: "Extremely dry",
        emoji: "🔴",
        color: "text-red-500",
    },
    "10": {
        label: "Very dry",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "15": {
        label: "Dry",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "25": {
        label: "Moderate",
        emoji: "🟢",
        color: "text-green-500",
    },
    "60": {
        label: "Moderate",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "70": {
        label: "Humid",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "80": {
        label: "Very humid",
        emoji: "🔴",
        color: "text-red-500",
    },
    "90": {
        label: "Extremely humid",
        emoji: "🟣",
        color: "text-purple-500",
    },
}

export const OUTDOOR_DEW_POINT_THRESHOLDS: Thresholds = {
    "0": {
        label: "Crisp",
        emoji: "🟢",
        color: "text-green-500",
    },
    "50": {
        label: "Comfortable",
        emoji: "🟢",
        color: "text-green-500",
    },
    "60": {
        label: "Sticky",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "65": {
        label: "Muggy",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "70": {
        label: "Uncomfortable",
        emoji: "🔴",
        color: "text-red-500",
    },
    "75": {
        label: "Oppressive",
        emoji: "🟣",
        color: "text-purple-500",
    },
}

export const OUTDOOR_PRESSURE_THRESHOLDS: Thresholds = {
    "980": {
        label: "Stormy",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "995": {
        label: "Fair",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "1005": {
        label: "Normal",
        emoji: "🟢",
        color: "text-green-500",
    },
    "1015": {
        label: "Clear",
        emoji: "🔵",
        color: "text-blue-500",
    },
    "1030": {
        label: "Very high",
        emoji: "🟣",
        color: "text-purple-500",
    },
}

export const ESP32_TEMP_THRESHOLDS: Thresholds = {
    "0": {
        label: "Great",
        emoji: "🟢",
        color: "text-green-500",
    },
    "60": {
        label: "Warm",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "70": {
        label: "Hot",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "80": {
        label: "Very hot",
        emoji: "🔴",
        color: "text-red-500",
    },
    "90": {
        label: "Dangerously hot",
        emoji: "🟣",
        color: "text-purple-500",
    },
}

export const ESP32_WIFI_THRESHOLDS: Thresholds = {
    "-110": {
        label: "No Signal",
        emoji: "⚫",
        color: "text-gray-500",
    },
    "-90": {
        label: "Unusable",
        emoji: "🔴",
        color: "text-red-500",
    },
    "-80": {
        label: "Weak",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "-70": {
        label: "Fair",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "-60": {
        label: "Good",
        emoji: "🟢",
        color: "text-green-500",
    },
    "-35": {
        label: "Excellent",
        emoji: "🔵",
        color: "text-blue-500",
    },
}

export const ESP32_VOLT_THRESHOLDS: Thresholds = {
    "0": {
        label: "Low",
        emoji: "🔴",
        color: "text-red-500",
    },
    "4.6": {
        label: "Fair",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "4.8": {
        label: "Normal",
        emoji: "🟢",
        color: "text-green-500",
    },
    "5.4": {
        label: "Elevated",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "5.6": {
        label: "High",
        emoji: "🔴",
        color: "text-red-500",
    },
}

export const ESP32_INTERNAL_TEMPERATURE: Thresholds = {
    "-100": {
        label: "Catastrophic",
        emoji: "🟣",
        color: "text-purple-500",
    },
    "-4": {
        label: "Critical",
        emoji: "🔴",
        color: "text-red-500",
    },
    "15": {
        label: "Serious",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "30": {
        label: "Elevated",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "50": {
        label: "Optimal",
        emoji: "🟢",
        color: "text-green-500",
    },
    "80": {
        label: "Elevated",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "95": {
        label: "Serious",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "113": {
        label: "Critical",
        emoji: "🔴",
        color: "text-red-500",
    },
    "125": {
        label: "Catastrophic",
        emoji: "🟣",
        color: "text-purple-500",
    },
}

export const ESP32_INTERNAL_HUMIDITY: Thresholds = {
    "0": {
        label: "Serious",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "10": {
        label: "OK",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "25": {
        label: "Acceptable",
        emoji: "🟢",
        color: "text-green-500",
    },
    "40": {
        label: "Optimal",
        emoji: "🟢",
        color: "text-green-500",
    },
    "60": {
        label: "Elevated",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "75": {
        label: "Serious",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "90": {
        label: "Critical",
        emoji: "🔴",
        color: "text-red-500",
    },
    "95": {
        label: "Catastrophic",
        emoji: "🟣",
        color: "text-purple-500",
    },
}

export const VOCS: Thresholds = {
    "0": {
        label: "Improved",
        emoji: "🔵",
        color: "text-blue-500",
    },
    "75": {
        label: "Baseline",
        emoji: "🟢",
        color: "text-green-500",
    },
    "125": {
        label: "Elevated",
        emoji: "🟡",
        color: "text-yellow-500",
    },
    "200": {
        label: "High",
        emoji: "🟠",
        color: "text-orange-500",
    },
    "300": {
        label: "Very High",
        emoji: "🔴",
        color: "text-red-500",
    },
    "400": {
        label: "Hazardous",
        emoji: "🟣",
        color: "text-purple-500",
    },
}

export type Threshold = {
    label: string;
    emoji: string;
    color?: string;
};

export type Thresholds = {
    [key: string]: Threshold;
};

export type SensorData = {
    indoor: {
        time: string;
        temperature: number;
        humidity: number;
        pressure: number;
        gas: number;
        vocs: number;
        carbon_dioxide: number;
        wifi_strength: number;
    };
    outdoor: {
        time: string;
        temp: number;
        hum: number;
        pressure: number;
        dew_point: number;
        internal_temp: number;
        internal_hum: number;
        esp32_temp: number;
        esp32_voltage: number;
        signal_strength: number;
    };
};

export type Conditions = {
    desc: string;
    emoji: string;
    sunrise?: string;
    sunset?: string;
};

export function getThresholdFromValue(thresholds: Thresholds, value: number): Threshold {
    let foundThreshold: Threshold = { emoji: "", label: "" };
    for (const [threshold, ranking] of Object.entries(thresholds).sort(([a], [b]) => Number(a) - Number(b))) {
        if (Number(value) < Number(threshold)) break;
        foundThreshold = ranking;
    }
    return foundThreshold;
}

export async function fetchData(): Promise<SensorData> {
    const res = await fetch("https://sensors.powerpcfan.xyz/");
    if (!res.ok) {
        throw new Error("Failed to fetch sensor data");
    } else {
        const data: SensorData = await res.json();
        return data;
    }
}

export const codeMapping: { [key: string]: Conditions } = {
    "0": {
        desc: "Clear skies",
        emoji: "☀️",
    },
    "1": {
        desc: "Partly sunny",
        emoji: "⛅️"
    },
    "2": {
        desc: "Partly cloudy",
        emoji: "🌥️",
    },
    "3": {
        desc: "Overcast",
        emoji: "☁️",
    },
    "45": {
        desc: "Fog",
        emoji: "🌫️",
    },
    "48": {
        // desc: "Depositing rime fog",
        desc: "Fog",
        emoji: "🌫️",
    },
    "51": {
        desc: "Light drizzle",
        emoji: "🌧️",
    },
    "53": {
        desc: "Moderate drizzle",
        emoji: "🌧️",
    },
    "55": {
        desc: "Dense drizzle",
        emoji: "🌧️",
    },
    "56": {
        desc: "Light freezing drizzle",
        emoji: "🌧️",
    },
    "57": {
        desc: "Dense freezing drizzle",
        emoji: "🌧️",
    },
    "61": {
        desc: "Slight rain",
        emoji: "🌧️",
    },
    "63": {
        desc: "Moderate rain",
        emoji: "🌧️",
    },
    "65": {
        desc: "Heavy rain",
        emoji: "🌧️",
    },
    "66": {
        desc: "Light freezing rain",
        emoji: "🌧️",
    },
    "67": {
        desc: "Heavy freezing rain",
        emoji: "🌧️",
    },
    "71": {
        desc: "Slight snowfall",
        emoji: "🌨️",
    },
    "73": {
        desc: "Moderate snowfall",
        emoji: "🌨️",
    },
    "75": {
        desc: "Heavy snowfall",
        emoji: "🌨️",
    },
    "77": {
        desc: "Snow grains",
        emoji: "🌨️",
    },
    "80": {
        desc: "Slight rain showers",
        emoji: "🌧️",
    },
    "81": {
        desc: "Moderate rain showers",
        emoji: "🌧️",
    },
    "82": {
        desc: "Violent rain showers",
        emoji: "🌧️",
    },
    "85": {
        desc: "Slight snow showers",
        emoji: "🌨️",
    },
    "86": {
        desc: "Heavy snow showers",
        emoji: "🌧️",
    },
    "95": {
        desc: "Thunderstorm",
        emoji: "⛈️",
    },
    "96": {
        desc: "Thunderstorm with slight hail",
        emoji: "⛈️",
    },
    "97": {
        desc: "Heavy thunderstorm",
        emoji: "⛈️",
    },
    "99": {
        desc: "Thunderstorm with heavy hail",
        emoji: "⛈️",
    },
}

export function formatTime(isoOrTimeStr: string): string {
    const timePart = isoOrTimeStr.includes("T") ? isoOrTimeStr.split("T")[1] : isoOrTimeStr;
    const [hStr, mStr] = timePart.split(":");
    let hours = parseInt(hStr, 10);
    const minutes = mStr ? mStr.slice(0, 2) : "00";
    if (isNaN(hours)) return isoOrTimeStr;
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${ampm}`;
}

export async function fetchConditions(): Promise<Conditions> {
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=42.3601&longitude=-71.0589&current=weather_code&daily=sunrise,sunset&timezone=America%2FNew_York");
    const data = await res.json();
    const code = data.current?.weather_code;
    const base = (code !== undefined && code !== null && codeMapping[code.toString()]) ? codeMapping[code.toString()] : { desc: "Unknown", emoji: "⛅️" };

    let sunrise: string | undefined;
    let sunset: string | undefined;

    if (data.daily && Array.isArray(data.daily.time)) {
        const currentDate = data.current?.time?.split("T")[0];
        let index = currentDate ? data.daily.time.indexOf(currentDate) : -1;
        if (index === -1) {
            index = 0;
        }

        if (data.daily.sunrise?.[index]) {
            sunrise = formatTime(data.daily.sunrise[index]);
        }
        if (data.daily.sunset?.[index]) {
            sunset = formatTime(data.daily.sunset[index]);
        }
    }

    return {
        ...base,
        sunrise,
        sunset,
    };
}

export function formatDate(iso: string): string {
    const dateObj = new Date(iso);
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(dateObj);
}