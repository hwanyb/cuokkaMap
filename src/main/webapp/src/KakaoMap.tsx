import React, {
    useState,
    MutableRefObject,
    useEffect,
    useRef,
    useMemo,
} from "react";

declare global {
    interface Window {
        kakao: any;
    }
}


function KakaoMap() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | string>("");
    useMemo(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        }

        function success(position: any) {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        }

        function error() {
            setLocation({
                latitude: 37.56667,
                longitude: 126.97806,
            });
            console.log("위치 받기 실패");
        }
    }, [navigator.geolocation.getCurrentPosition]);

    const mapRef = useRef<HTMLElement | null>(null);


    const initMap = () => {
        if(typeof location !== "string"){

            const container = document.getElementById("map");
            const options = {
                center: new window.kakao.maps.LatLng(location.latitude, location.longitude),
                level: 7,
            };
            var map = new window.kakao.maps.Map(container as HTMLElement, options);
            (mapRef as MutableRefObject<any>).current = map;
        }
    };

    useEffect(() => {
        window.kakao.maps.load(() => initMap());
    }, [mapRef, location]);

    return <><div id="map" style={{  width:"90vw", height:"90vh" }} /><button style={{ position:"relative", zIndex:"2"}} onClick={() => initMap()}>위치 조정</button></>;
}

export default KakaoMap;