import React, {useState, useEffect} from 'react';
import styled, {css} from "styled-components";
import axios from "axios";
import {Tag, Icon} from "../../../styles/common";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentFilter, setIsBookmarkMode} from "../../../modules/filterReducer";
import {RootState} from "../../../modules";
import {setIsOpenedCafeInfo} from "../../../modules/viewReducer";

const Base = styled.div`
  position: absolute;
  top: 4rem;
  //right: 30rem;
  left: 45vw;
  display: flex;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  @media ${props => props.theme.windowSize.laptop} {
    width: 100vw;
    top: 8rem;
    left: 0;
    justify-content: space-between;
    padding: 0 3rem;
  }
  @media ${props => props.theme.windowSize.mobile} {
    top: 7rem;
    padding: 0 2rem;
  }

  & > button:last-child {
    margin-right: 0;
  }
`;
const FilterTag = styled(Tag)`
  white-space: nowrap;
  margin-bottom: 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  ${props => props.active && css`
    &::before {
      width: 10px;
      height: 10px;
      content: "";
      display: inline-block;
      background-color: ${props.id === "decaf" ?
              props.theme.color.defaf : props.id === "soy" ?
                      props.theme.color.soy : props.id === "zero" ?
                              props.theme.color.zero : props.id === "oat" ?
                                      props.theme.color.oat : props.id === "lactos" ? props.theme.color.lacto : "black"};
      border-radius: 50%;
      margin-right: 10px;
    }
  `}
`;


type filterContentType = {
    name: string,
    id: string
}[]

type FilterContainerProps = {
    setSearchDBKeyword: React.Dispatch<React.SetStateAction<string>>;
}
const FilterContainer = ({setSearchDBKeyword}: FilterContainerProps) => {
    const dispatch = useDispatch();

    const currentFilter = useSelector((state: RootState) => state.filterReducer.currentFilter);
    const isBookmarkMode = useSelector((state: RootState) => state.filterReducer.isBookmarkMode);
    const isOpenedPostCafe = useSelector((state: RootState) => state.viewReducer.isOpenedPostCafe);
    const isLoggedin = useSelector((state: RootState) => state.userReducer.isLoggedin);

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

    const filterClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (event.currentTarget.id === currentFilter[0]) {
            dispatch(setCurrentFilter([]));
            dispatch(setIsOpenedCafeInfo(false));
        } else {
            setSearchDBKeyword("");
            dispatch(setCurrentFilter([event.currentTarget.id]));
        }
    }
    const filterBookmarkHandler = (event:React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        dispatch(setIsBookmarkMode(!isBookmarkMode));
        dispatch(setIsOpenedCafeInfo(false));

    }


    return (
        <Base>
            {
                isLoggedin && (
                    <FilterTag
                        clickable={true}
                        active={isBookmarkMode}
                        onClick={filterBookmarkHandler}
                    >
                        <Icon className="material-symbols-rounded">bookmark_border</Icon>
                    </FilterTag>
                )
            }
            {filterContent.map((filter: { name: string, id: string }, i: number) => (
                <FilterTag clickable={true}
                           active={currentFilter.includes(filter.id)}
                           onClick={filterClickHandler}
                           key={i}
                           id={filter.id}
                           disabled={isOpenedPostCafe}
                >
                    {filter.name}
                </FilterTag>
            ))}
        </Base>
    )
}

export default FilterContainer;