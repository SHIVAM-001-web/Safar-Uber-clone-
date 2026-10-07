const axios = require('axios');
const captainModel = require('../models/captain.model');

// ---------------------------------------------------
// 1. Address -> Latitude & Longitude
// Nominatim / OpenStreetMap
// ---------------------------------------------------
module.exports.getAddressCoordinate = async (address) => {

    if (!address) {
        throw new Error('Address is required');
    }

    const url = 'https://nominatim.openstreetmap.org/search';

    try {

        const response = await axios.get(url, {
            params: {
                q: address,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'Uber-Clone-App/1.0'
            }
        });

        if (!response.data || response.data.length === 0) {
            throw new Error('Unable to find coordinates');
        }

        const location = response.data[0];

        return {
            ltd: parseFloat(location.lat),
            lng: parseFloat(location.lon)
        };

    } catch (error) {

        console.error('Nominatim Error:', error.message);
        throw error;
    }
};


// ---------------------------------------------------
// 2. Distance & Time
// OSRM / OpenStreetMap
// ---------------------------------------------------
module.exports.getDistanceTime = async (origin, destination) => {

    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {

        // First convert origin address to coordinates
        const originCoordinates =
            await module.exports.getAddressCoordinate(origin);

        // Convert destination address to coordinates
        const destinationCoordinates =
            await module.exports.getAddressCoordinate(destination);


        const { lng: originLng, ltd: originLat } = originCoordinates;

        const {
            lng: destinationLng,
            ltd: destinationLat
        } = destinationCoordinates;


        // OSRM expects:
        // longitude,latitude
        const url =
            `https://router.project-osrm.org/route/v1/driving/` +
            `${originLng},${originLat};${destinationLng},${destinationLat}`;


        const response = await axios.get(url, {
            params: {
                overview: false
            }
        });


        if (
            response.data.code !== 'Ok' ||
            !response.data.routes ||
            response.data.routes.length === 0
        ) {
            throw new Error('No routes found');
        }


        const route = response.data.routes[0];


        return {
            distance: {
                text: `${(route.distance / 1000).toFixed(2)} km`,
                value: route.distance
            },

            duration: {
                text: `${Math.round(route.duration / 60)} mins`,
                value: route.duration
            }
        };

    } catch (error) {

        console.error('OSRM Error:', error.message);
        throw error;
    }
};


// ---------------------------------------------------
// 3. Autocomplete Suggestions
// Nominatim / OpenStreetMap
// ---------------------------------------------------
module.exports.getAutoCompleteSuggestions = async (input) => {

    if (!input) {
        throw new Error('Query is required');
    }

    try {

        const response = await axios.get(
            'https://nominatim.openstreetmap.org/search',
            {
                params: {
                    q: input,
                    format: 'json',
                    addressdetails: 1,
                    limit: 5
                },

                headers: {
                    'User-Agent': 'Uber-Clone-App/1.0'
                }
            }
        );


        return response.data
            .map(place => place.display_name)
            .filter(value => value);

    } catch (error) {

        console.error('Autocomplete Error:', error.message);
        throw error;
    }
};


// ---------------------------------------------------
// 4. Find Captains Within Radius
// MongoDB Geospatial Query
// ---------------------------------------------------
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    const captains = await captainModel.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, ltd]
                },
                $maxDistance: radius * 1000
            }
        }
    });

    return captains;
};