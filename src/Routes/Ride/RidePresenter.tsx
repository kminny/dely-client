import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import Button from "../../Components/Button";
import {
  DataRow,
  ItemTitle,
  ItemValue,
  Wrapper
} from "../../Components/Shared";
import UserCard from "../../Components/UserCard";

const Container = styled.div`
  padding: 15px;
  & input {
    margin-bottom: 10px;
  }
`;

const Header = styled.div`
  background-color: black;
  color: white;
  padding: 15px;
  font-size: 28px;
`;

interface IProps {
  loading: boolean;
  data: any;
  cancelRide: () => void;
  pickUp: () => void;
  redirectToChat: () => void;
  finishRide: () => void;
  redirectToHome: () => void;
}

const ACCEPTED = "ACCEPTED";
const ONROUTE = "ONROUTE";
const CANCELED = "CANCELED";
const FINISHED = "FINISHED";

const RidePresenter: React.SFC<IProps> = ({
  loading,
  data: { getRide: { isDriver = false, ride = null } = {} } = {},
  data,
  cancelRide,
  pickUp,
  redirectToChat,
  finishRide,
  redirectToHome
}) => (
  <Wrapper>
    <Helmet>
      <title>Quest | dely</title>
    </Helmet>
    <Header>Quest</Header>
    {!loading && ride && (
      <Container>
        <DataRow>
          <ItemValue>{isDriver ? "요구자" : "배달자"}</ItemValue>
        </DataRow>
        {isDriver ? (
          <UserCard
            name={ride.passenger.fullName}
            major={ride.passenger.major}
            photo={ride.passenger.profilePhoto}
            phoneNumber={ride.passenger.phoneNumber}
          />
        ) : (
          <UserCard
            name={ride.driver.fullName}
            major={ride.driver.major}
            photo={ride.driver.profilePhoto}
            phoneNumber={ride.driver.phoneNumber}
          />
        )}
        <DataRow>
          <ItemTitle>시작 위치:</ItemTitle>
          <ItemValue>{ride.pickUpLocation}</ItemValue>
        </DataRow>
        <DataRow>
          <ItemTitle>목적지:</ItemTitle>
          <ItemValue>{ride.dropOffLocation}</ItemValue>
        </DataRow>
        <DataRow>
          <ItemTitle>물품 명:</ItemTitle>
          <ItemValue>{ride.product}</ItemValue>
        </DataRow>
        <DataRow>
          <ItemTitle>가격:</ItemTitle>
          <ItemValue>￦{ride.price}</ItemValue>
        </DataRow>
        <DataRow>
          <ItemTitle>상태:</ItemTitle>
          {ride.status === ACCEPTED && (
            <ItemValue>수락 (물품 획득 전)</ItemValue>
          )}
          {ride.status === ONROUTE && (
            <ItemValue>물품 획득 후 가는 중</ItemValue>
          )}
          {ride.status === CANCELED && <ItemValue>취소됨</ItemValue>}
          {ride.status === FINISHED && <ItemValue>끝남</ItemValue>}
        </DataRow>

        {!isDriver && (
          <React.Fragment>
            <Button
              onClick={redirectToChat}
              text={`💬 ${isDriver ? "요구자와 채팅" : "배달자와 채팅"}`}
            />
            {ride.status === ONROUTE && (
              <Button text={"완료"} bgColor={"#1abc9c"} onClick={finishRide} />
            )}
            <Button onClick={cancelRide} bgColor={"#e74c3c"} text={"취소"} />
          </React.Fragment>
        )}
        {isDriver && ride.status !== FINISHED && (
          <React.Fragment>
            <Button
              onClick={redirectToChat}
              text={`💬 ${isDriver ? "요구자와 채팅" : "배달자와 채팅"}`}
            />
            {ride.status === ACCEPTED && (
              <Button onClick={pickUp} bgColor={"#1abc9c"} text={"물품 획득"} />
            )}
            <Button onClick={cancelRide} bgColor={"#e74c3c"} text={"취소"} />
          </React.Fragment>
        )}

        {ride.status === FINISHED && (
          <Button onClick={redirectToHome} bgColor={"#1abc9c"} text={"완료"} />
        )}
      </Container>
    )}
    {!loading && ride === null && (
      <Container>
        <div>error</div>
        <div>Contact to 010-8297-0157</div>
      </Container>
    )}
  </Wrapper>
);

export default RidePresenter;
