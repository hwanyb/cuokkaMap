import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {Button} from "../../../styles/common";

const Base = styled.div`
  //background-color: #fff;
  //width: 400px;
  //height: 45vh;
  //position: absolute;
  //z-index: 1000;
  //top: 327px;
  //left: 0;
  //padding: 2rem;
  //box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  //display: flex;
  //flex-direction: column;
  //justify-content: space-between;
  //border-radius: 2rem;
`;

const CafeInfoPhotoReview = () => {
    //사진파일 받아와서 사진 후기에 뿌려줄 배열
    const [photoData, setPhotoData] = useState<File>();

    // 허용가능한 확장자 목록!
    const ALLOW_FILE_EXTENSION = "jpg,jpeg,png";
    const FILE_SIZE_MAX_LIMIT = 10 * 1024 * 1024;  // 10MB

    // //사진 업로드할 때 보낼 요청
    // const submit = () => {
    //     useEffect(() => {
    //         fetch("불러오는 url", {
    //             method:"POST",
    //
    //         })
    //     },[])
    // }
    const uploadFileReview = (event:React.ChangeEvent<HTMLInputElement>) => {
        const target = event.currentTarget;
        const files = (target.files as FileList)[0];
        console.log(files);

        if(files === undefined) return;

    }


    return(
        <Base>
            <Button style={{width: '100%'}}>
                <label htmlFor="file" style={{cursor:"pointer"}}>
                    <div className="btn-upload">파일 업로드하기</div>
                </label>
                <input type="file" name="file" id="file" style={{display:"none"}} onChange={uploadFileReview}/>
            </Button>
            <div style={{height:"100%", }}>
                {/*{photoData && photoData.map(*/}
                {/*이미지 사이즈 동일하게 맞추고 그 안에서 fit하게 */}
                {/*    (data, i) => (*/}
                {/*        <img src={data} alt="reviewImage"/>*/}
                {/*<span className="material-symbols-outlined">close</span>*/}
                {/*    )*/}
                {/*)}*/}
            </div>
        </Base>
    )
}

export default CafeInfoPhotoReview;