import PropTypes from "prop-types";
import React from "react";
import { MutationFn } from "react-apollo";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import Button from "../../Components/Button";
import Form from "../../Components/Form";
import Header from "../../Components/Header";
import Input from "../../Components/Input";
import { Container, Wrapper } from "../../Components/Shared";

const FakeLink = styled.span`
  text-decoration: underline;
  color: ${props => props.theme.blue};
  margin-bottom: 40px;
  display: block;
  cursor: pointer;
`;

interface IProps {
  fav: boolean;
  name: string;
  address: string;
  onSubmit: MutationFn;
  loading: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  goToFindAddress: () => void;
  lat: number | undefined;
  lng: number | undefined;
}

const AddPlacePresenter: React.SFC<IProps> = ({
  handleInputChange,
  name,
  address,
  loading,
  onSubmit,
  goToFindAddress,
  lat,
  lng
}) => (
  <Wrapper>
    <Helmet>
      <title>Add Place | dely</title>
    </Helmet>
    <Header backTo="/places" title={"주소 추가"} />
    <Container>
      <Form onSubmit={onSubmit}>
        {lat && lng && (
          <Input
            value={name}
            onChange={handleInputChange}
            type={"text"}
            name={"name"}
            required={true}
            displayName={"이름"}
          />
        )}
        {lat && lng && (
          <Input
            value={address}
            onChange={handleInputChange}
            type={"text"}
            name={"address"}
            required={true}
            displayName={"상세 주소"}
          />
        )}

        <FakeLink onClick={goToFindAddress}>지도에서 주소 찾기</FakeLink>

        <Button
          disabled={loading || !lat || !lng}
          text={loading ? "주소 추가 중" : "주소 추가하기"}
        />
      </Form>
    </Container>
  </Wrapper>
);

AddPlacePresenter.propTypes = {
  fav: PropTypes.bool,
  name: PropTypes.string,
  address: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  goToFindAddress: PropTypes.func.isRequired
};

export default AddPlacePresenter;
