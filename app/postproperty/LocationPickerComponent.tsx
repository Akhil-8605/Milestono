import MapView, { Marker, MapPressEvent, Region } from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';
import { ViewStyle } from 'react-native';

type Props = {
    onLocationSelect: (e: MapPressEvent) => void;
    style?: ViewStyle;
    location: { latitude: number; longitude: number } | null;
};

const LocationPickerComponent = ({ onLocationSelect, style, location }: Props) => {
    const mapRef = useRef<MapView>(null);
    const [marker, setMarker] = useState(location);

    useEffect(() => {
        if (location) {
            setMarker(location);

            const region: Region = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };

            mapRef.current?.animateToRegion(region, 1000);
        }
    }, [location]);

    const handleMapPress = (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const newLocation = { latitude, longitude };
        setMarker(newLocation);
        onLocationSelect(event);
    };

    return (
        <MapView
            ref={mapRef}
            style={style}
            onPress={handleMapPress}
            initialRegion={{
                latitude: location?.latitude || 26.8467,
                longitude: location?.longitude || 75.8258,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
        >
            {marker && <Marker coordinate={marker} />}
        </MapView>
    );
};

export default LocationPickerComponent;