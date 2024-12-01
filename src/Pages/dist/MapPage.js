"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var react_google_maps_1 = require("@vis.gl/react-google-maps");
var MapPage = function () {
    var _a = react_1.useState(null), game = _a[0], setGame = _a[1]; // To store the game object with POI data
    var _b = react_1.useState([]), pois = _b[0], setPois = _b[1]; // To store the fetched POI data
    var _c = react_1.useState(null), positionPlayer = _c[0], setPositionPlayer = _c[1];
    var _d = react_1.useState(null), openIndex = _d[0], setOpenIndex = _d[1]; // Track which InfoWindow is open
    var mapCenter = { lat: 52.544569, lng: 13.354061 };
    react_1.useEffect(function () {
        // Fetch the game first, which contains the POI data
        var fetchGame = function () { return __awaiter(void 0, void 0, void 0, function () {
            var responseGame, gameData, poiIdArray, pois_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, fetch("http://localhost:3443/api/game/")];
                    case 1:
                        responseGame = _a.sent();
                        if (!responseGame.ok) {
                            throw new Error("Failed to fetch game");
                        }
                        return [4 /*yield*/, responseGame.json()];
                    case 2:
                        gameData = _a.sent();
                        poiIdArray = gameData.poilId;
                        if (!Array.isArray(poiIdArray)) {
                            throw new Error("poiId is not an array or does not exist");
                        }
                        return [4 /*yield*/, Promise.all(poiIdArray.map(function (id) { return __awaiter(void 0, void 0, void 0, function () {
                                var response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, fetch("http://localhost:3443/api/poi/" + id)];
                                        case 1:
                                            response = _a.sent();
                                            if (!response.ok) {
                                                throw new Error("Failed to fetch data for ID: " + id);
                                            }
                                            return [2 /*return*/, response.json()]; // Assuming the response matches the POI structure
                                    }
                                });
                            }); }))];
                    case 3:
                        pois_1 = _a.sent();
                        console.log("POIs:", pois_1);
                        setGame(gameData);
                        setPois(pois_1); // Save the POIs in state
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Error fetching game:", error_1);
                        console.log("There has been an error fetching POIs");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchGame();
        // Watch for player position
        if (navigator.geolocation) {
            var watchId_1 = navigator.geolocation.watchPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                setPositionPlayer({ lat: latitude, lng: longitude });
                console.log("Updated Position - Latitude: " + latitude + ", Longitude: " + longitude);
            }, function (error) {
                console.error("Error watching position:", error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            });
            return function () { return navigator.geolocation.clearWatch(watchId_1); };
        }
        else {
            console.log("Geolocation not supported");
        }
    }, []);
    return (react_1["default"].createElement(react_google_maps_1.APIProvider, { apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "" },
        react_1["default"].createElement("div", { style: { height: "90vh" } },
            react_1["default"].createElement(react_google_maps_1.Map, { defaultZoom: 10, defaultCenter: mapCenter, mapId: process.env.REACT_APP_GOOGLE_MAPS_MAP_ID || "" },
                pois.map(function (poi, index) { return (react_1["default"].createElement(react_google_maps_1.AdvancedMarker, { key: poi.id, position: { lat: poi.lat, lng: poi.long }, onClick: function () { return setOpenIndex(index); } },
                    react_1["default"].createElement(react_google_maps_1.Pin, { background: "green", borderColor: "black", glyphColor: "black" }),
                    openIndex === index && (react_1["default"].createElement(react_google_maps_1.InfoWindow, { position: { lat: poi.lat, lng: poi.long }, onCloseClick: function () { return setOpenIndex(null); } },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("h3", null, poi.name),
                            react_1["default"].createElement("p", null, poi.beschreibung),
                            react_1["default"].createElement("p", null,
                                "Points: ",
                                poi.punkte)))))); }),
                positionPlayer && (react_1["default"].createElement(react_google_maps_1.AdvancedMarker, { position: positionPlayer },
                    react_1["default"].createElement(react_google_maps_1.Pin, { background: "white" })))))));
};
exports["default"] = MapPage;
