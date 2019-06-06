import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import Button from "../../Components/Button";
import { DataRow, ItemTitle, ItemValue } from "../../Components/Shared";
import UserCard from "../../Components/UserCard";
import { IDriverElementsProps } from "./HomeInterfaces";

const Container = styled.div`
  position: absolute;
  margin: auto;
  width: 80vw;
  height: 100vw;
  background-color: white;
  box-shadow: ${props => props.theme.boxShadow};
  border-radius: 5px;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DriverElements: React.SFC<IDriverElementsProps> = ({
  hasRequest,
  request,
  acceptRide,
  cancelRide
}) =>
  hasRequest && request && request.status === "REQUESTING" ? (
    <Container>
      {console.log(hasRequest, request, acceptRide, cancelRide)}
      <UserCard
        photo={request.passenger.profilePhoto}
        name={request.passenger.fullName}
        major={request.passenger.major}
      />
      <DataRow>
        <ItemTitle>시작 위치:</ItemTitle>
        <ItemValue>{request.pickUpLocation}</ItemValue>
      </DataRow>
      <DataRow>
        <ItemTitle>목적지:</ItemTitle>
        <ItemValue>{request.dropOffLocation}</ItemValue>
      </DataRow>
      <DataRow>
        <ItemTitle>물품 명:</ItemTitle>
        <ItemValue>{request.product}</ItemValue>
      </DataRow>
      <DataRow>
        <ItemTitle>가격:</ItemTitle>
        <ItemValue>￦{request.price}</ItemValue>
      </DataRow>
      {request.status === "REQUESTING" && (
        <Button onClick={acceptRide} text={"요구 수락"} />
      )}
      {request.status !== "REQUESTING" && (
        <Button onClick={cancelRide} text={"취소"} />
      )}
    </Container>
  ) : (
    <Container>
      <div>hi</div>
      {console.log(hasRequest)}
      {console.log(request)}
      {console.log(acceptRide)}
      {console.log(cancelRide)}
    </Container>
  );

DriverElements.propTypes = {
  hasRequest: PropTypes.bool.isRequired,
  request: PropTypes.object
};

export default DriverElements;
