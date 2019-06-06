import PropTypes from "prop-types";
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ActionButton from "../../Components/ActionButton";
import Header from "../../Components/Header";
import Place from "../../Components/Place";
import Section from "../../Components/Section";
import { Container, Wrapper } from "../../Components/Shared";

const NoPlaces = styled.div``;

const SLink = styled(Link)`
  text-decoration: underline;
  color: ${props => props.theme.blue};
`;

interface IProps {
  addPlaceRedirect: () => void;
  places: object[];
  loading: boolean;
}

const PlacesPresenter: React.SFC<IProps> = ({
  addPlaceRedirect,
  places,
  loading
}) => (
  <Wrapper>
    <Helmet>
      <title>Places | dely</title>
    </Helmet>
    <Header backTo="/settings" title={"즐겨찾는 주소"} />
    <Container>
      {places.length === 0 ? (
        <NoPlaces>
          즐겨찾는 주소가 없습니다.{" "}
          <SLink to="/add-place">지금 추가하세요!</SLink>
        </NoPlaces>
      ) : (
        <React.Fragment>
          <Section first={true} title={"즐겨 찾기"}>
            {places
              .filter((place: any) => place.fav === true)
              .map((place: any) => (
                <Place
                  name={place.name}
                  address={place.address}
                  fav={true}
                  key={place.id}
                  id={place.id}
                />
              ))}
          </Section>
          <Section title={"다른 추가된 주소"}>
            {places
              .filter((place: any) => place.fav === false)
              .map((place: any) => (
                <Place
                  name={place.name}
                  address={place.address}
                  fav={false}
                  key={place.id}
                  id={place.id}
                />
              ))}
          </Section>
        </React.Fragment>
      )}
      <ActionButton onClick={addPlaceRedirect} icon={"plus"} disabled={false} />
    </Container>
  </Wrapper>
);

PlacesPresenter.propTypes = {
  loading: PropTypes.bool.isRequired,
  addPlaceRedirect: PropTypes.func.isRequired,
  places: PropTypes.array.isRequired
};

export default PlacesPresenter;
