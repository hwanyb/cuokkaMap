import React, {useState, useEffect} from 'react';
import styled from "styled-components";
import axios from "axios";
import {Tag} from "../../../styles/common";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentFilter} from "../../../modules/filterReducer";
import {RootState} from "../../../modules";



const Base = styled.div``;
const FilterBtn = styled.input`
      margin-right: 10px;
    `;

type filterContentType = {
    name: string,
    id: string
}[]

const FilterContainer = () => {
    const dispatch = useDispatch();

    const currentFilter = useSelector((state: RootState) => state.filterReducer.currentFilter);
    //필터된 카페 정보
    // const [filteredCafeInfo, setFilteredCafeInfo] = useState<object[]>();

    //필터될 5가지 정보
    const filterContent: filterContentType = [
        {
            name: "디카페인",
            id: "decaf"
        },
        {
            name: "락토프리 우유",
            id: "lactos"
        },
        {
            name: "두유",
            id: "soy"
        },
        {
            name: "오트밀크",
            id: "oat"
        },
        {
            name: "제로시럽",
            id: "zero"
        },
    ]
    //유동적으로 필터를 추가하게 될거면...원래는 DB에서 받아와야 되냐며
    // const [filterInfo, setFilterInfo] = useState<string[]>();
    // useEffect(() => {
    //     axios.get('필터가져오는 url')
    //         .then(res => {setFilterInfo(res)})
    //         .catch(err => console.log(err))
    // },[])



    const filterClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        // console.log(event.currentTarget.value, event.currentTarget.id);
        //event.currentTarget.value를 서버로 보내서 해당 필터에 해당되는 정보만 받아오도록
        // try {
        //     axios.post('서버로 보내는 api url', {
        //         data: {
        //             //서버에 보낼 필터 키워드
        //             filter: event.currentTarget.value
        //         }
        //     }).then((res: any) => {
        //         setFilteredCafeInfo(res);
        //         console.log(res);
        //     }).catch((err) => console.log(err));
        // } catch (error) {
        //     console.log(error);
        // }

        dispatch(setCurrentFilter(event.currentTarget.id))
    }

    useEffect(() => {
        console.log(currentFilter)

    })
    return (
        <Base>
            {
                filterContent.map((filter: { name: string, id: string }, i: number) => (
                    <FilterBtn type="button" onClick={filterClickHandler} key={i} id={filter.id} value={filter.name}/>))
            }
        </Base>
    )
}

export default FilterContainer;