import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import styled from 'styled-components';

const Header = styled(Layout.Header)`
  position: fixed;
  width: 100%;
  height: 45px;
  z-index: 2;

  .logo {
    float: left;
    display: flex;
    align-items: center;
    margin-right: 20px;
    height: 45px;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    i {
      margin-right: 10px;
    }
  }

  ul {
    line-height: 45px;
  }
`;

const Content = styled(Layout.Content)`
  background: white;
`;

export default props => {
  const { component: Component, ...rest } = props;

  const handleClickMenu = e => {
    props.history.replace(e.key);
  };

  return (
    <Layout>
      <Header>
        <div className="logo">
          <Icon type="github" /> Top Developers
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[props.location.pathname]} onClick={handleClickMenu}>
          <Menu.Item key="/search">Search</Menu.Item>
          <Menu.Item key="/users">Users</Menu.Item>
          <Menu.Item key="/test">Test</Menu.Item>
        </Menu>
      </Header>
      <Content>
        <Component {...rest} />
      </Content>
    </Layout>
  );
};
