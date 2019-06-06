import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import Header from "../../Components/Header";

const Container = styled.div`
  width: 100%;
  padding: 0 15px;
  padding-top: 150px;
`;

const Wrapper = styled.div`
  overflow-y: scroll;
  height: 100%;
`;

const TripsPresenter: React.SFC = () => (
  <Wrapper className={"shouldScroll"}>
    <Helmet>
      <title> Notes | dely</title>
    </Helmet>
    <Header backTo="/" title={"공지 사항"} />
    <Container>
      <div>준비중입니다.</div>
    </Container>
  </Wrapper>
);

export default TripsPresenter;
