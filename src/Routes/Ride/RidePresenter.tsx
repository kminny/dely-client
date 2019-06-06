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
          <ItemValue>{isDriver ? "Your customer" : "Your deliver"}</ItemValue>
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
          <ItemTitle>From:</ItemTitle>
          <ItemValue>{ride.pickUpLocation}</ItemValue>
        </DataRow>
        <DataRow>
          <ItemTitle>To:</ItemTitle>
          <ItemValue>{ride.dropOffLocation}</ItemValue>
        </DataRow>
        <DataRow>
          <ItemTitle>Product:</ItemTitle>
          <ItemValue>{ride.product}</ItemValue>
        </DataRow>
        <DataRow>
          <ItemTitle>Price:</ItemTitle>
          <ItemValue>￦{ride.price}</ItemValue>
        </DataRow>
        <DataRow>
          <ItemTitle>Status:</ItemTitle>
          {ride.status === ACCEPTED && <ItemValue>Accepted</ItemValue>}
          {ride.status === ONROUTE && <ItemValue>On Route</ItemValue>}
          {ride.status === CANCELED && <ItemValue>Canceled</ItemValue>}
          {ride.status === FINISHED && <ItemValue>FINISHED</ItemValue>}
        </DataRow>

        {!isDriver && (
          <React.Fragment>
            <Button
              onClick={redirectToChat}
              text={`💬 Send message to ${isDriver ? "customer" : "deliver"}`}
            />
            {ride.status === ONROUTE && (
              <Button
                text={"Finish delying"}
                bgColor={"#1abc9c"}
                onClick={finishRide}
              />
            )}
            <Button onClick={cancelRide} bgColor={"#e74c3c"} text={"Cancel"} />
          </React.Fragment>
        )}
        {isDriver && ride.status !== FINISHED && (
          <React.Fragment>
            <Button
              onClick={redirectToChat}
              text={`💬 Send message to ${isDriver ? "customer" : "deliver"}`}
            />
            {ride.status === ACCEPTED && (
              <Button onClick={pickUp} bgColor={"#1abc9c"} text={"Picked up"} />
            )}
            <Button onClick={cancelRide} bgColor={"#e74c3c"} text={"Cancel"} />
          </React.Fragment>
        )}

        {ride.status === FINISHED && (
          <Button
            onClick={redirectToHome}
            bgColor={"#1abc9c"}
            text={"FINISHED"}
          />
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
