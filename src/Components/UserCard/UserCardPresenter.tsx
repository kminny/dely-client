import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { ItemTitle, ItemValue } from "../Shared";

interface IProps {
  photo: string;
  name: string;
  phoneNumber?: string;
  major?: string;
  rating?: number;
}

const User = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: center;
`;

const Image = styled.img`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  margin-right: 15px;
`;

const Column = styled.div``;

const UserCardPresenter: React.SFC<IProps> = ({
  photo,
  name,
  major,
  rating,
  phoneNumber
}) => (
  <User>
    <Image src={photo} />
    <Column>
      <ItemValue>{name}</ItemValue>
      <br />
      <br />
      <ItemValue>{major}</ItemValue>
      <br />
      <br />
      {phoneNumber && <ItemTitle>PHONE: {phoneNumber}</ItemTitle>}
      {rating && <ItemTitle>{rating}</ItemTitle>}
    </Column>
  </User>
);

UserCardPresenter.propTypes = {
  photo: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  major: PropTypes.string,
  rating: PropTypes.number,
  phoneNumber: PropTypes.string
};

export default UserCardPresenter;
