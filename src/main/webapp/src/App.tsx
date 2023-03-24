import React from 'react';
import {useEffect, useState} from "react";
import KakaoMap from "./components/home/KakaoMap";

function App() {
    const [welcomeMessage, setWelcomeMessage] = useState("/img/loading_img.gif");

    useEffect(() => {
        fetch("/api/hello")
            .then(response => response.text())
            .then(function (message) {
                setWelcomeMessage(message);
            });
    }, []);

    return (
        <div className="App">
            {/*//     <style>*/}
            {/*//         @import url('https://fonts.googleapis.com/css2?family=Hi+Melody&display=swap');*/}
            {/*//     </style>*/}
            {/*//     <header className="App-header">*/}
            {/*//         <div style={{height :"50vh",width :"50vw",margin:"25vh 25vw", alignContent:"center", fontFamily:"Hi Melody", fontSize : "2vw"}}>*/}
            {/*//             <div style={{margin:"auto", textAlign:"center"}}> 이 텍스트는 프론트 서버 구현을 통해 보여지는 텍스트 입니다! </div>*/}
            {/*//             <div style={{margin:"auto", textAlign:"center"}}> 백엔드가 연결되고 나면 아래에 귀여운 커카가 나타날거에요!</div><br/>*/}
            {/*//             <img style={{height : "40vh", width:"50vw", margin:"auto", objectFit:"none"}} src={welcomeMessage}/>*/}
            {/*//         </div>*/}
            {/*//     </header>*/}
            <KakaoMap/>
        </div>
    );
}

export default App;
