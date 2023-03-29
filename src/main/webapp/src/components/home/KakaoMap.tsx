import React, {
    useState,
    useEffect,
} from "react";

import PostCafeInfo from "./PostCafeInfo";
import MapNavigationBar from "./header/MapNavigationBar";
import {Button, Icon} from "../../styles/common";
import CafeInfo from "./CafeInfo";
import cafeDummy from "../../cafeDummy.json";
import {useSelector} from "react-redux";
import {RootState} from "../../modules";
import axios from "axios";


declare global {
    interface Window {
        kakao: any;
    }
}

type markerInfo = {
    address_name: string,
    category_group_code: string,
    category_group_name: string,
    distance: string,
    id: string,
    phone?: string,
    place_name: string,
    place_url?: string,
    road_address_name?: string,
    x: number,
    y: number
};
const KakaoMap = () => {
    const currentFilter = useSelector((state: RootState) => state.filterReducer.currentFilter);
    //카페추가 버튼으로 해당 컴포넌트 보이게 하는 state
    const [visible, setVisible] = useState<boolean>(false);
    //검색어 : PostCafeInfo 컴포넌트의 카페찾기 input에서 조작
    const [keyword, setKeyword] = useState<string>("");
    //마커를 클릭해서 카페추가에 올릴 정보
    const [clickMarkerCafeInfo, setClickMarkerCafeInfo] = useState<markerInfo>();

    const [mapstate, setMapstate] = useState<any>();

    //카페 추가 시 추가되는 정보로 만들 마커 배열 state
    // const [markers, setMarkers] = useState<any[]>([]);
    var markers: any[] = [];
    var dbMarkers: any[] = [];

    // console.log(markers)

    //MapNav에서 검색된 데이터를 담을 마커 배열 state
    const [searchedPlaceInfoInNav, setSearchedPlaceInfoInNav] = useState<object[]>([]);

    //CafeInfo 컴포넌트를 띄우기 위한 state MapNavigationBar에서 search된 카페를 띄워줌
    const [confirmCafeInfo, setConfirmCafeInfo] = useState<boolean>(false);

    //DB검색된 카페 클릭시 해당 정보와 함게 CafeInfo 컴포넌트 띄워주기 위한 state
    const [cafeInfoCheck, setCafeInfoCheck] = useState<boolean>(false);
    //DB검색된 카페 클릭시 해당 마커의 정보만 담을 state
    const [cafeInfoContainer, setCafeInfoContainer] = useState<object>();

    useEffect(() => {
        if (searchedPlaceInfoInNav.length > 0) {
            displayDBPlaces(searchedPlaceInfoInNav);
        }
    }, [searchedPlaceInfoInNav])

    useEffect(() => {
        //지도를 담을 div선택
        const container = document.getElementById("map");
        //지도 만들기 옵션

        let options = {}
        if (mapstate === undefined) {
            options = {
                center: new window.kakao.maps.LatLng(37.56667, 126.97806),
                level: 4,
            };
        } else {
            options = {
                center: new window.kakao.maps.LatLng(mapstate.getCenter().getLat(), mapstate.getCenter().getLng()),
                level: 4,
            };
        }
        //지도 만드는 객체
        var map = new window.kakao.maps.Map(container as HTMLElement, options);

        setMapstate(map);
    }, [keyword]);

    var filterMarkerImgSrc = `${process.env.PUBLIC_URL}/assets/images/markers/${currentFilter}.png`;
    var filterImgSize = new window.kakao.maps.Size(38, 38);
    var filterMarkerImg = new window.kakao.maps.MarkerImage(filterMarkerImgSrc, filterImgSize);


    useEffect(() => {
        markers = [...cafeDummy];
        for (let i = 0; i < markers.length; i++) {

            var filterMarker = new window.kakao.maps.Marker({
                image: filterMarkerImg,
                position: new window.kakao.maps.LatLng(markers[i].y, markers[i].x)
            });
        }
        filterMarker.setMap(mapstate);
        markers = filterMarker

        console.log(markers)

    }, []);


    useEffect(() => {
        markers = cafeDummy.filter(i => i.tag.includes(currentFilter));
        console.log(markers)

        for (let i = 0; i < markers.length; i++) {
            let position = new window.kakao.maps.LatLng(markers[i].y, markers[i].x);
            addFilterMarker(position)
        }
    }, [currentFilter])


    // 현재 위치 DB에 저장된 데이터 전부 불러온 후 현재 지도에 마커띄우는 함수
    function addFilterMarker(position: any) {
        markers = [];
        var filterMarker = new window.kakao.maps.Marker({
            image: filterMarkerImg,
            position: position
        });
        filterMarker.setMap(mapstate);
        markers = filterMarker

        return filterMarker
    }

    useEffect(() => {
        if (searchedPlaceInfoInNav.length > 0) {
            displayDBPlaces(searchedPlaceInfoInNav);
            // setCafeInfoContainer(searchedPlaceInfoInNav[cafeInfoIndex]);
        }
    }, [searchedPlaceInfoInNav]);


    //키워드 검색을 요청하는 함수
    function searchPlaces() {
        //2번불러와지고 카페목록은 나오지만 마커는 안나옴
        if (mapstate !== undefined) {
            //장소 검색 객체를 통해 키워드로 장소검색을 요청합니다.
            //keywordSearch() : 입력한 키워드로 검색하는 함수 options 활용 필요
            //https://apis.map.kakao.com/web/documentation/#services_Places_keywordSearch
            placeSearch.keywordSearch(keyword, placesSearchCB, {
                code: "CE7", // 카페만 검색 코드 추가
                location: mapstate.getCenter(),
                size: 10,
                page: 1,
                sort: window.kakao.maps.services.SortBy.Distance,
            });
            // 중복 코드라 주석처리합니다. -환희
            // window.kakao.maps.event.addListener(mapstate, 'center_changed', function () {
            //     mapstate.setCenter(mapstate.getCenter());
            // });
        }
        removeMarker();
    }

    //장소 검색 객체 생성
    var placeSearch = new window.kakao.maps.services.Places();

    //검색 결과 목록이나 마커를 클릭했을 때 장소명을 표시할 인포 윈도우 생성
    var infowindow = new window.kakao.maps.InfoWindow({zIndex: 1});


    //장소검색이 완료됬을 때 호출하는 콜백함수
    function placesSearchCB(data: any, status: any) {
        if (mapstate !== undefined) {
            if (status === window.kakao.maps.services.Status.OK) {

                //정상적으로 검색이 완료됬으면 검색 목록과 마커 표출
                displayPlaces(data);

            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert("검색 결과가 존재하지 않습니다");
                return;
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert("검색 결과 중 오류가 발생했습니다.");
                return;
            }
        }
    }


    //카페추가 창 검색 결과 목록과 마커를 표출하는 함수
    function displayPlaces(places: any[]) {
        if (mapstate !== undefined) {
            const listEl = document.getElementById('placesList'),
                resultEl = document.getElementById('search-result'),
                fragment = document.createDocumentFragment(),
                bounds = new window.kakao.maps.LatLngBounds();
            // 검색 결과 목록에 추가된 항목들을 제거
            listEl && removeAllChildNods(listEl);

            // 지도에 표시되고 있는 마커를 제거
            removeMarker();

            //검색결과 목록으로 List요소 만들기, bounds : 검색된 좌표만큼의 범위 넓히기
            for (let i = 0; i < places.length; i++) {
                // 마커를 생성하고 지도에 표시
                let placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x),
                    marker = addMarker(placePosition, i, undefined),
                    itemEl: HTMLElement | undefined = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가
                bounds.extend(placePosition);

                if (itemEl !== undefined) {
                    // 마커와 검색결과 항목에 mouseover 했을때
                    // 해당 장소에 인포윈도우에 장소명을 표시
                    // mouseout 했을 때는 인포윈도우를 닫기
                    (function (marker: any, data: any) {
                        window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                            displayInfowindow(marker, data.place_name);
                        });

                        window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                            infowindow.close();
                        });

                        itemEl.onmouseover = function () {
                            displayInfowindow(marker, data.place_name);
                        };

                        itemEl.onmouseout = function () {
                            infowindow.close();
                        };

                        itemEl.onclick = function () {
                            setClickMarkerCafeInfo(data);
                            setKeyword("")
                        }

                        window.kakao.maps.event.addListener(marker, 'click', function () {
                            setClickMarkerCafeInfo(data);
                        });
                    })(marker, places[i])
                    fragment.appendChild(itemEl);
                }
            }
            // 검색결과 항목들을 검색결과 목록 Element에 추가
            listEl && listEl.appendChild(fragment);
            if (resultEl) {
                resultEl.scrollTop = 0;
            }
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정
            mapstate.setBounds(bounds);
        }
    }

    //DB의 카페 검색 결과 목록과 마커를 표출하는 함수
    function displayDBPlaces(places: any[]) {
        if (mapstate !== undefined) {
            const listEl = document.getElementById('placesList'),
                bounds = new window.kakao.maps.LatLngBounds();

            // 검색 결과 목록에 추가된 항목들을 제거
            listEl && removeAllChildNods(listEl);

            mapstate.setCenter(new window.kakao.maps.LatLng(places[0].y, places[0].x));

            removeMarker();

            //검색결과 목록으로 List요소 만들기, bounds : 검색된 좌표만큼의 범위 넓히기
            for (var i = 0; i < places.length; i++) {
                // 마커를 생성하고 지도에 표시
                let placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x),
                    marker = addDBMarker(placePosition, places[i].place_name);

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가
                bounds.extend(placePosition);

                // 마커와 검색결과 항목에 mouseover 했을때
                // 해당 장소에 인포윈도우에 장소명을 표시
                // mouseout 했을 때는 인포윈도우를 닫기
                (function (marker: any, data: any) {
                    window.kakao.maps.event.addListener(marker, 'click', function () {
                        setCafeInfoContainer(data);
                        setCafeInfoCheck(true);
                        console.log(data);
                    });
                })(marker, places[i])
            }

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정
            mapstate.setBounds(bounds);
            mapstate.setLevel(mapstate.getLevel() + 1);
        }
    }

    //검색결과 항목을 Element로 반환하는 함수
    function getListItem(index: number, places: any) {
        if (mapstate !== undefined) {
            const el = document.createElement("li");

            let itemStr = `<span className="markerbg marker_${index + 1}" ></span>
                                <div className="info"><h5>${places.place_name}</h5>
                                ${places.road_address_name
                ? `<span>${places.road_address_name}</span>
    <!--                                <span className="jibun gray">${places.address_name}</span>-->
                                    `
                : `<span>${places.address_name}</span>`
            }
                                </div>`;
            el.innerHTML = itemStr;
            el.className = "item";

            return el;
        }
    }

    //마커를 생성하고 지도 위에 마커를 표시하는 함수
    function addMarker(position: () => {}, idx: number, title?: undefined) {
        if (mapstate !== undefined) {
            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
                imageSize = new window.kakao.maps.Size(34, 37), //마커크기
                imgOptions = {
                    spriteSize: new window.kakao.maps.Size(36, 691), //스프라이트 크기
                    spriteOrigin: new window.kakao.maps.Point(0, (idx * 46) + 10), //스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                    offset: new window.kakao.maps.Point(13, 37) //마커 좌표에 일치시킬 이미지 내에서의 좌표
                },
                markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                marker = new window.kakao.maps.Marker({
                    position: position,
                    image: markerImage,
                    title: title
                });

            marker.setMap(mapstate);
            markers.push(marker);

            return marker;
        }
    }

    function addDBMarker(position: () => {}, title?: undefined) {
        if (mapstate !== undefined) {
            //마커 이미지 URL
            let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                //마커 크기
                imageSize = new window.kakao.maps.Size(45, 47),
                // 마커이미지의 옵션, 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정
                imageOption = {offset: new window.kakao.maps.Point(27, 69)};

            // 마커의 이미지정보를 가지고 있는 마커이미지를 생성
            var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            // 마커 생성
            var marker = new window.kakao.maps.Marker({
                position: position,
                image: markerImage, // 마커이미지 설정
                title: title
            });

            // 마커가 지도 위에 표시되도록 설정
            marker.setMap(mapstate);
            markers.push(marker);

            return marker;
        }
    }

    //검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
    //인포윈도우에 장소명 표시
    //마커에 마우스 오버됬을 때 카드 만들 수 있는 곳
    function displayInfowindow(marker: any, title: string) {
        if (mapstate !== undefined) {
            var content = `<div style={{padding:"5px",zIndex:"1"}} >${title}</div>`

            infowindow.setContent(content);
            infowindow.open(mapstate, marker);
        }
    }

    //검색경로가 목록의 자식 Element를 제거하는 함수
    function removeAllChildNods(el: HTMLElement) {
        if (mapstate !== undefined) {
            while (el.hasChildNodes()) {
                el.lastChild && el.removeChild(el.lastChild);
            }
        }
    }

    var currentLocation = () => {
        if (navigator.geolocation) {
            //Gelocation으로 현재 위치 얻기
            navigator.geolocation.getCurrentPosition((position) => {
                var currentLat = position.coords.latitude,
                    currentLng = position.coords.longitude;
                if (mapstate !== undefined) mapstate.setCenter(new window.kakao.maps.LatLng(currentLat, currentLng))
            })
        }
    }

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarker() {
        //DB검색한 것이 있을때
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }

    //postCafeInfo 열기
    const postCafeInfoVisible = () => {
        setVisible(true)
        setCafeInfoCheck(false);
        removeMarker();
    }

    //PostCafeInfo 닫기
    const closePostCafeInfo = () => {
        setVisible(false);
        removeMarker();
        setKeyword("");
    }

    return <>
        <div id="map" style={{width: "100vw", height: "100vh"}}/>
        <MapNavigationBar setSearchedPlaceInfoInNav={setSearchedPlaceInfoInNav} setConfirmCafeInfo={setConfirmCafeInfo}
                          removeMarker={removeMarker}/>
        <Button style={{position: "absolute", top: "9vh", right: "2vw", zIndex: "100"}}
                onClick={currentLocation}
        >
            <span className="material-symbols-rounded">my_location</span>
        </Button>
        {visible ? (
            mapstate ? (
                <PostCafeInfo setKeyword={setKeyword} closePostCafeInfo={closePostCafeInfo}
                              clickMarkerCafeInfo={clickMarkerCafeInfo}
                              searchPlaces={searchPlaces}/>
            ) : null
        ) : (
            <button
                style={{
                    width: "100px",
                    zIndex: "100",
                    position: "absolute",
                    bottom: "10vh",
                    right: "calc(50vw - 50px)"
                }}
                onClick={postCafeInfoVisible}>카페추가
            </button>
        )
        }
        {cafeInfoCheck && <CafeInfo cafeInfoContainer={cafeInfoContainer} setCafeInfoCheck={setCafeInfoCheck}/>}
    </>;
}

export default KakaoMap;