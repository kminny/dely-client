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

const Item = styled<any, any>("div")`
  cursor: pointer;
`;

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
    <Header backTo="/" title={"계정 정보"} />
    {loading || !user || !places ? (
      <Container>
        <Button
          onClick={onErrorRefresh}
          bgColor={"#a90722"}
          text={"Error, 새로고침을 위해 클릭해주세요."}
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
          <Section title="즐겨찾는 주소">
            {places.length === 0 || !places ? (
              <NoPlaces>
                아직 즐겨찾는 주소가 없습니다.{" "}
                <FakeLink to={"/add-place"}>주소 추가하기</FakeLink>
              </NoPlaces>
            ) : (
              <React.Fragment>
                <Place
                  name={places[0].name}
                  fav={places[0].fav}
                  address={places[0].address}
                  id={places[0].id}
                />
                <FakeLink>더 많은 주소 보기</FakeLink>
              </React.Fragment>
            )}
          </Section>
        </Link>
        <Section last={true}>
          <Item onClick={logUserOut}>로그 아웃</Item>
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
