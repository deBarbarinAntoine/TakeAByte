const bcrypt = require('bcryptjs');

const saltRounds = 12;

function newHash(pwd) {
    bcrypt.hash(pwd, saltRounds, function(err, hash) {
        if (err) {
            throw err;
        }
        return hash;
    });
}

function matchPwd(user, pwd) {
    bcrypt.compare(pwd, user.hash, function(err, result) {
        if (err) {
            console.error(err);
            return false;
        }
        return result;
    });
}

module.exports = {newHash, matchPwd};

/*
type T struct {
    Id                  int         `json:"id"`
    Name                string      `json:"name"`
    Type                string      `json:"type"`
    Description         string      `json:"description"`
    Price               int         `json:"price"`
    Image               string      `json:"image,omitempty"`
    Processor           string      `json:"processor,omitempty"`
    RAM                 string      `json:"RAM,omitempty"`
    Storage             string      `json:"storage,omitempty"`
    BatteryPowerTime    string      `json:"battery_power_time,omitempty"`
    ScreenType          string      `json:"screen_type,omitempty"`
    Resolution          string      `json:"resolution,omitempty"`
    Camera              string      `json:"camera,omitempty"`
    Connectivity        string      `json:"connectivity,omitempty"`
    OperatingSystem     string      `json:"operating_system,omitempty"`
    Sensor              string      `json:"sensor,omitempty"`
    Megapixels          string      `json:"megapixels,omitempty"`
    DisplaySize         string      `json:"display_size,omitempty"`
    Gps                 string      `json:"gps,omitempty"`
    Cellular            string      `json:"cellular,omitempty"`
    FilmFormat          string      `json:"film_format,omitempty"`
    BatteryPower        string      `json:"battery_power,omitempty"`
    Watts               string      `json:"watts,omitempty"`
    Cores               interface{} `json:"cores,omitempty"`
    Socket              string      `json:"socket,omitempty"`
    Memory              string      `json:"memory,omitempty"`
    StorageCapacity     string      `json:"storage_capacity,omitempty"`
    Interface           string      `json:"interface,omitempty"`
    FormFactor          string      `json:"form_factor,omitempty"`
    Wifi                string      `json:"wifi,omitempty"`
    Capacity            string      `json:"capacity,omitempty"`
    Speed               string      `json:"speed,omitempty"`
    GraphicsCard        string      `json:"graphics_card,omitempty"`
    Display             string      `json:"display,omitempty"`
    Size                string      `json:"size,omitempty"`
    RefreshRate         string      `json:"refresh_rate,omitempty"`
    ResponseTime        string      `json:"response_time,omitempty"`
    Touchscreen         string      `json:"touchscreen,omitempty"`
    Materials           string      `json:"materials,omitempty"`
    Layout              string      `json:"layout,omitempty"`
    Lighting            string      `json:"lighting,omitempty"`
    SwitchType          string      `json:"switch_type,omitempty"`
    Wattage             string      `json:"wattage,omitempty"`
    Certification       string      `json:"certification,omitempty"`
    Curve               string      `json:"curve,omitempty"`
    SocketCompatibility string      `json:"socket_compatibility,omitempty"`
    NoiseLevel          string      `json:"noise_level,omitempty"`
    Portability         string      `json:"portability,omitempty"`
    SensorSize          string      `json:"sensor_size,omitempty"`
    LensMount           string      `json:"lens_mount,omitempty"`
    Function            string      `json:"function,omitempty"`
    Compatibility       string      `json:"compatibility,omitempty"`
    Airflow             string      `json:"airflow,omitempty"`
    NoiseCancellation   string      `json:"noise_cancellation,omitempty"`
    SyncTechnology      string      `json:"sync_technology,omitempty"`
    SidePanel           string      `json:"side_panel,omitempty"`
    Weight              string      `json:"weight,omitempty"`
    Microphone          string      `json:"microphone,omitempty"`
    GraphicsCardType    string      `json:"graphics_card_type,omitempty"`
    PerformanceFocus    string      `json:"performance_focus,omitempty"`
    Grade               string      `json:"grade,omitempty"`
    VideoRecording      string      `json:"video_recording,omitempty"`
    Os                  string      `json:"os,omitempty"`
    BatteryLife         string      `json:"battery_life,omitempty"`
    Brand               string      `json:"brand,omitempty"`
    Durability          string      `json:"durability,omitempty"`
    Keyboard            string      `json:"keyboard,omitempty"`
    BusinessOriented    string      `json:"business_oriented,omitempty"`
    SecurityFeatures    string      `json:"security_features,omitempty"`
    Zoom                string      `json:"zoom,omitempty"`
    SmartAssistant      string      `json:"smart_assistant,omitempty"`
    Coverage            string      `json:"coverage,omitempty"`
    Technology          string      `json:"technology,omitempty"`
    Stabilization       string      `json:"stabilization,omitempty"`
    GamingOriented      string      `json:"gaming_oriented,omitempty"`
    Features            string      `json:"features,omitempty"`
    Style               string      `json:"style,omitempty"`
    WiFiStandard        string      `json:"wi-fi_standard,omitempty"`
    Benefits            string      `json:"benefits,omitempty"`
    SensorResolution    string      `json:"sensor_resolution,omitempty"`
    Autofocus           string      `json:"autofocus,omitempty"`
    Weatherproof        string      `json:"weatherproof,omitempty"`
    TargetAudience      string      `json:"target_audience,omitempty"`
    Uses                string      `json:"uses,omitempty"`
    CpuGeneration       string      `json:"cpu_generation,omitempty"`
    Performance         string      `json:"performance,omitempty"`
    GSyncCompatible     string      `json:"g_sync_compatible,omitempty"`
    AspectRatio         string      `json:"aspect_ratio,omitempty"`
    PowerConsumption    string      `json:"power_consumption,omitempty"`
    PanelType           string      `json:"panel_type,omitempty"`
    Cpu                 string      `json:"cpu,omitempty"`
    Options             string      `json:"options,omitempty"`
    PortabilityFocused  string      `json:"portability_focused,omitempty"`
}
*/