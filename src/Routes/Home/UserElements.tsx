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
          {status === "choosingFromMap"
            ? "위치 설정 취소"
            : "지도에서 위치 설정하기"}
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
          displayName={"시작 위치 (ex. 백년관)"}
        />
        <Input
          onChange={handleInputChange}
          value={endAddress}
          name={"endAddress"}
          type={"text"}
          required={true}
          displayName={"목적지 (ex. 기숙사)"}
        />
        <Input
          onChange={handleInputChange}
          value={product}
          name={"product"}
          type={"text"}
          required={true}
          displayName={"물품 종류 (ex. 책, 편의점 물품 구매)"}
        />
        <Button width={"100%"} text={"확인"} onClick={addedProductToOpposite} />
      </Container>
    )}
    {status === "foundDirections" && addedProduct === true && (
      <ExtendedContainer>
        <Title>시작 위치</Title>
        <Data>{startAddress}</Data>
        <Title>목적지</Title>
        <Data>{endAddress}</Data>
        <Title>물품 종류</Title>
        <Data>{product}</Data>
        <br />
        <br />
        <br />
        <Button
          width={"100%"}
          onClick={requestRide}
          text={`Dely 요청하기 (￦${price})`}
        />
        <br />
        <br />
        <Button
          width={"100%"}
          bgColor={"#a90722"}
          text={"요구 수정하기"}
          onClick={addedProductToOpposite}
        />
      </ExtendedContainer>
    )}
    <AbsContainer top={false}>
      {status === "choosingFromMap" && (
        <Button width={"90%"} onClick={chooseMapAddress} text={"완료"} />
      )}
      {status === "findingDirections" && (
        <Button disabled={true} width={"90%"} onClick={null} text={"찾는 중"} />
      )}

      {status === "requesting" && (
        <React.Fragment>
          <Button width={"90%"} onClick={null} text={`배달자 찾는중...`} />
          <br />
          <Button
            width={"90%"}
            onClick={cancelRide}
            bgColor={"#e74c3c"}
            text={"취소"}
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
