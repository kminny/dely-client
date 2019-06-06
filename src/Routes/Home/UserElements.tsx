import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import AddressInput from "../../Components/AddressInput";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import { IUserElementsProps } from "./HomeInterfaces";
import { AbsContainer, Btn } from "./HomeStyled";

const Container = styled.div`
  background-color: white;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 80%;
  height: 70%;
  z-index: 9;
  padding: 20px;
`;

const ExtendedContainer = styled.div`
  background-color: white;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 80%;
  height: 60%;
  z-index: 9;
  padding: 20px;
`;

const Title = styled.h4`
  font-weight: 800;
  margin-top: 30px;
  margin-bottom: 10px;
  &:first-child {
    margin-top: 0;
  }
`;

const Data = styled.span`
  color: ${props => props.theme.blueColor};
`;

const UserElements: React.SFC<IUserElementsProps> = ({
  toAddress,
  handleInputChange,
  submitAddress,
  toggleMapChoosing,
  chooseMapAddress,
  requestRide,
  price,
  status,
  cancelRide,
  addedProduct,
  addedProductToOpposite,
  startAddress,
  endAddress,
  product
}) => (
  <React.Fragment>
    {status !== "foundDirections" && status !== "requesting" && (
      <AbsContainer top={true}>
        <AddressInput
          value={toAddress}
          name={"toAddress"}
          onChange={handleInputChange}
          onSubmit={submitAddress}
          placeholder={"요구의 목적지를 입력하세요."}
          width={"90%"}
          disabled={status === "choosingFromMap"}
        />
        <Btn onClick={toggleMapChoosing}>
          {status === "choosingFromMap" ? "Stop choosing" : "Choose from map"}
        </Btn>
      </AbsContainer>
    )}

    {status === "foundDirections" && addedProduct === false && (
      <Container>
        <Input
          onChange={handleInputChange}
          value={startAddress}
          name={"startAddress"}
          type={"text"}
          required={true}
          displayName={"Start Address detail"}
        />
        <Input
          onChange={handleInputChange}
          value={endAddress}
          name={"endAddress"}
          type={"text"}
          required={true}
          displayName={"To Address detail"}
        />
        <Input
          onChange={handleInputChange}
          value={product}
          name={"product"}
          type={"text"}
          required={true}
          displayName={"Product"}
        />
        <Button
          width={"100%"}
          text={"Confirm"}
          onClick={addedProductToOpposite}
        />
      </Container>
    )}
    {status === "foundDirections" && addedProduct === true && (
      <ExtendedContainer>
        <Title>Start Address</Title>
        <Data>{startAddress}</Data>
        <Title>End Address</Title>
        <Data>{endAddress}</Data>
        <Title>Product</Title>
        <Data>{product}</Data>
        <br />
        <br />
        <br />
        <Button
          width={"100%"}
          onClick={requestRide}
          text={`Request Dely (￦${price})`}
        />
        <br />
        <br />
        <Button
          width={"100%"}
          bgColor={"#a90722"}
          text={"Change the Quest"}
          onClick={addedProductToOpposite}
        />
      </ExtendedContainer>
    )}
    <AbsContainer top={false}>
      {status === "choosingFromMap" && (
        <Button
          width={"90%"}
          onClick={chooseMapAddress}
          text={"Pick this place"}
        />
      )}
      {status === "findingDirections" && (
        <Button
          disabled={true}
          width={"90%"}
          onClick={null}
          text={"Finding directions"}
        />
      )}

      {status === "requesting" && (
        <React.Fragment>
          <Button width={"90%"} onClick={null} text={`Finding deliver...`} />
          <br />
          <Button
            width={"90%"}
            onClick={cancelRide}
            bgColor={"#e74c3c"}
            text={"Cancel"}
          />
        </React.Fragment>
      )}
    </AbsContainer>
  </React.Fragment>
);

UserElements.propTypes = {
  toAddress: PropTypes.string,
  handleInputChange: PropTypes.func.isRequired,
  submitAddress: PropTypes.func.isRequired,
  toggleMapChoosing: PropTypes.func.isRequired,
  chooseMapAddress: PropTypes.func.isRequired,
  requestRide: PropTypes.func.isRequired,
  price: PropTypes.number,
  status: PropTypes.string.isRequired,
  cancelRide: PropTypes.func,
  addedProduct: PropTypes.bool,
  addedProductToOpposite: PropTypes.func
};

export default UserElements;
