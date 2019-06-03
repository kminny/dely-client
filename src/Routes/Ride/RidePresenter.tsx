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
}

const ACCEPTED = "ACCEPTED";
const ONROUTE = "ONROUTE";
const CANCELED = "CANCELED";
const FINISHED = "FINISHED";

const RidePresenter: React.SFC<IProps> = ({
  loading,
  data: { getRide: { isDriver = false, ride = null } = {} } = {},
  cancelRide,
  pickUp,
  redirectToChat,
  finishRide
}) => (
  <Wrapper>
    <Helmet>
      <title>Quest | dely</title>
    </Helmet>
    <Header>Quest</Header>
    {!loading && ride && (
      <Container>
        {console.log(ride)}
        <DataRow>
          <ItemValue>{isDriver ? "Your customer" : "Your deliver"}</ItemValue>
        </DataRow>
        {isDriver ? (
          <UserCard
            name={ride.passenger.fullName}
            major={ride.passenger.major}
            photo="/home/kmseo/img/person.png"
          />
        ) : (
          <UserCard
            name={ride.driver.fullName}
            major={ride.driver.major}
            photo={ride.driver.profilePhoto}
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

        <Button
          onClick={redirectToChat}
          text={`💬 Send message to ${isDriver ? "customer" : "deliver"}`}
        />

        {isDriver && (
          <React.Fragment>
            {ride.status === ONROUTE && (
              <Button
                text={"Finish delying"}
                bgColor={"#1abc9c"}
                onClick={finishRide}
              />
            )}
            {ride.status !== ONROUTE && (
              <Button onClick={pickUp} bgColor={"#1abc9c"} text={"Picked up"} />
            )}
          </React.Fragment>
        )}

        <Button onClick={cancelRide} bgColor={"#e74c3c"} text={"Cancel"} />
      </Container>
    )}
  </Wrapper>
);

export default RidePresenter;
