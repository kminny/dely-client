import PropTypes from "prop-types";
import React from "react";
import { MutationFn } from "react-apollo";
// import FontAwesome from "react-fontawesome";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../../Components/Button";
import Header from "../../Components/Header";
import Place from "../../Components/Place";
import Section from "../../Components/Section";
import { Container, Wrapper } from "../../Components/Shared";

/*
const Placeholder = styled.div`
  display: flex;
  justify-content: center;
`;
*/

const Image = styled.img`
  height: 60px;
  width: 60px;
  border-radius: 50%;
`;

const GridLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 4fr;
`;

const Keys = styled.div``;

const Key = styled.span`
  display: block;
  margin-bottom: 5px;
`;

const Item = styled<any, any>("div")``;

const NoPlaces = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const SLink = styled<any, any>(Link)`
  color: ${props => props.theme.blue};
  margin-top: 30px;
  display: block;
  width: 100%;
`;

const FakeLink = SLink.withComponent("span");

interface IProps {
  loading: boolean;
  data: any;
  logUserOut: MutationFn;
  onErrorRefresh: () => void;
}

const SettingsPresenter: React.SFC<IProps> = ({
  loading,
  data: { me: { user = null } = {} } = {} || "",
  data: { getPlaces: { places = null } = {} } = {} || "",
  logUserOut,
  onErrorRefresh
}) => (
  <Wrapper className={"shouldScroll"}>
    <Helmet>
      <title>Account Settings | dely</title>
    </Helmet>
    <Header backTo="/" title={"Account Settings"} />
    {loading || !user || !places ? (
      <Container>
        <Button
          onClick={onErrorRefresh}
          bgColor={"#a90722"}
          text={"Caught on Error, Click to Refresh"}
        />
      </Container>
    ) : (
      <Container>
        <Section first={true}>
          <GridLink to={"/edit-account"}>
            <Image src={user.profilePhoto} />
            <Keys>
              <Key>{user.fullName}</Key>
              <Key>{user.phoneNumber}</Key>
              <Key>{user.email}</Key>
            </Keys>
          </GridLink>
        </Section>

        <Link to={"/places"}>
          <Section title="Favorites">
            {places.length === 0 || !places ? (
              <NoPlaces>
                You have no favorite places yet.{" "}
                <FakeLink to={"/add-place"}>Add one</FakeLink>
              </NoPlaces>
            ) : (
              <React.Fragment>
                <Place
                  name={places[0].name}
                  fav={places[0].fav}
                  address={places[0].address}
                  id={places[0].id}
                />
                <FakeLink>More Saved Places</FakeLink>
              </React.Fragment>
            )}
          </Section>
        </Link>
        <Section last={true}>
          <Item onClick={logUserOut}>Log Out</Item>
        </Section>
      </Container>
    )}
  </Wrapper>
);

SettingsPresenter.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  logUserOut: PropTypes.func.isRequired
};

export default SettingsPresenter;
