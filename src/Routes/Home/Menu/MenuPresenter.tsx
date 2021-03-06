import React from "react";
import { MutationFn } from "react-apollo";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
`;

const Header = styled.div`
  background-color: black;
  height: 20%;
  margin-bottom: 30px;
  padding: 0 15px;
  color: white;
`;

const SLink = styled(Link)`
  font-size: 22px;
  display: block;
  margin-left: 15px;
  margin-bottom: 25px;
  font-weight: 400;
`;

const Image = styled.img`
  height: 80px;
  width: 80px;
  background-color: grey;
  border-radius: 40px;
  overflow: hidden;
`;

const Name = styled.h2`
  font-size: 22px;
  color: white;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Rating = styled.h5`
  font-size: 18px;
  color: white;
`;

const Text = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Placeholder = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 10px;
  height: 100%;
  align-items: center;
`;

const ToggleDriving = styled.button`
  -webkit-appearance: none;
  background-color: #f1c40f;
  width: 100%;
  color: white;
  font-size: 18px;
  border: 0;
  padding: 15px 0px;
  cursor: pointer;
`;

interface IProps {
  loading: boolean;
  data: any;
  toggleDriving: MutationFn;
}

const MenuPresenter: React.SFC<IProps> = ({
  loading,
  data: { me: { user = null } = {} } = {} || "",
  toggleDriving
}) => (
  <Container>
    <Header>
      {loading ? (
        <Placeholder>
          <FontAwesome name="spinner fa-spin" />
        </Placeholder>
      ) : (
        <Grid>
          <Link to={"/edit-account"}>
            <Image src={user.profilePhoto} />
          </Link>
          <Text>
            <Name>{user.fullName}</Name>
            <Rating>가는 길에 획득: ￦ {user.balance}</Rating>
          </Text>
        </Grid>
      )}
    </Header>
    <SLink to="/trips">공지 사항</SLink>
    <SLink to="/settings">설정</SLink>
    <ToggleDriving onClick={toggleDriving as any}>
      {user && user.isDriving ? "Dely 멈추기" : "Dely 시작!!"}
    </ToggleDriving>
  </Container>
);

export default MenuPresenter;
