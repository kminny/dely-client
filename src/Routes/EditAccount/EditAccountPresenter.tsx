import PropTypes from "prop-types";
import React from "react";
import { MutationFn } from "react-apollo";
import { Helmet } from "react-helmet";
import Button from "../../Components/Button";
import FileInput from "../../Components/FileInput";
import Form from "../../Components/Form";
import Header from "../../Components/Header";
import Input from "../../Components/Input";
import { Container, Wrapper } from "../../Components/Shared";

interface IProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: MutationFn;
  loading: boolean;
  password: string;
  profilePhoto: string;
  major: string;
  getProfileImage: (url: string) => void;
}

const EditAccountPresenter: React.SFC<IProps> = ({
  firstName,
  lastName,
  phoneNumber,
  email,
  handleInputChange,
  loading,
  onSubmit,
  password,
  profilePhoto,
  major,
  getProfileImage
}) => (
  <Wrapper>
    <Helmet>
      <title>Edit Account | dely</title>
    </Helmet>
    <Header backTo="/" title={"회원 정보 수정"} />
    <Container>
      <Form onSubmit={onSubmit}>
        <FileInput
          postUpload={getProfileImage}
          required={false}
          previousUrl={profilePhoto}
        />
        <Input
          onChange={handleInputChange}
          value={firstName}
          name={"firstName"}
          type={"text"}
          required={true}
          displayName={"이름"}
        />
        <Input
          onChange={handleInputChange}
          value={lastName}
          name={"lastName"}
          type={"text"}
          required={true}
          displayName={"성"}
        />
        <Input
          onChange={handleInputChange}
          value={major}
          name={"major"}
          type={"text"}
          required={true}
          displayName={"소속 학과"}
        />
        <Input
          onChange={handleInputChange}
          value={phoneNumber}
          name={"phoneNumber"}
          type={"tel"}
          required={true}
          displayName={"핸드폰 번호"}
        />
        <Input
          onChange={handleInputChange}
          value={email}
          name={"email"}
          type={"tel"}
          required={true}
          displayName={"이메일 주소"}
        />
        <Input
          onChange={handleInputChange}
          value={password}
          name={"password"}
          type={"password"}
          required={false}
          displayName={"비밀번호"}
          placeholder={"••••••"}
        />
        <Button text={loading ? "적용 중" : "변경"} disabled={loading} />
      </Form>
    </Container>
  </Wrapper>
);

EditAccountPresenter.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  phoneNumber: PropTypes.string,
  email: PropTypes.string,
  handleInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  password: PropTypes.string,
  profilePhoto: PropTypes.string,
  getProfileImage: PropTypes.func.isRequired
};

export default EditAccountPresenter;
