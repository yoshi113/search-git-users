import React from 'react';
import { connect } from 'react-redux';
import { Button, Spin, Input, Select, List, Avatar, Icon } from 'antd';
import { getUsersAction } from '../../redux/users';
import { formatNumber } from '../../utils/helper';
import { LoadingWrapper, StatusBar } from '../../components';
import Wrapper from './styled';

const { Option } = Select;
const InputGroup = Input.Group;

class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageSize: 10,
      searchField: '',
      searchText: ''
    };
  }

  componentDidMount() {
    if (!this.props.loadingUsers && !this.props.users) {
      this.props.getUsersAction();
    }
  }

  onChangePage = pageNumber => {
    this.setState({ pageNumber });
  };

  onShowSizeChange = (pageNumber, pageSize) => {
    this.setState({ pageNumber, pageSize });
  };

  onSearchText = event => {
    this.setState({ searchText: event.target.value.toLowerCase() });
  };

  onSearchField = searchField => {
    this.setState({ searchField });
  };

  render() {
    const { loadingUsers, users, getUsersAction } = this.props;
    const { pageNumber, pageSize, searchField, searchText } = this.state;

    if (!users) {
      return (
        <LoadingWrapper>
          <Spin size="large" />
        </LoadingWrapper>
      );
    }

    const filteredUsers = users.filter(user => {
      if (searchField) {
        return user[searchField] && user[searchField].toLowerCase().indexOf(searchText) >= 0;
      }
      return (
        (user.login && user.login.toLowerCase().indexOf(searchText) >= 0) ||
        (user.name && user.name.toLowerCase().indexOf(searchText) >= 0) ||
        (user.email && user.email.toLowerCase().indexOf(searchText) >= 0) ||
        (user.location && user.location.toLowerCase().indexOf(searchText) >= 0)
      );
    });

    const pageUsers = filteredUsers.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    return (
      <Wrapper>
        <header>
          <div>
            <InputGroup compact>
              <Input
                allowClear
                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="input search text"
                onChange={this.onSearchText}
                style={{ width: '200px' }}
              />
              <Select defaultValue="All" onChange={this.onSearchField} style={{ width: '100px' }}>
                <Option value="">All</Option>
                <Option value="login">Id</Option>
                <Option value="name">Name</Option>
                <Option value="email">Email</Option>
                <Option value="location">Location</Option>
              </Select>
            </InputGroup>
          </div>
          <div>
            <Button loading={loadingUsers} icon="sync" onClick={getUsersAction}>
              Refresh
            </Button>
          </div>
        </header>

        <List
          dataSource={pageUsers}
          pagination={{
            showSizeChanger: true,
            total: filteredUsers.length,
            onChange: this.onChangePage,
            onShowSizeChange: this.onShowSizeChange
          }}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <a href={`https://github.com/${item.login}`} target="_blank" rel="noopener noreferrer">
                    <Avatar src={item.avatar} shape="square" size={48} />
                  </a>
                }
                title={
                  <div>
                    <a
                      href={`https://github.com/${item.login}`}
                      className="user-id"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.login}
                    </a>
                    <span className="user-name">{item.name}</span>
                  </div>
                }
                description={
                  <div>
                    <div className="user-info">
                      <span>Repos: {formatNumber(item.repos)}</span>
                      <span>Followers: {formatNumber(item.followers)}</span>
                      <span>Following: {formatNumber(item.following)}</span>
                    </div>
                    <div>
                      {item.location && (
                        <span>
                          <Icon type="environment" />
                          {item.location}
                        </span>
                      )}
                      <span>
                        <Icon type="mail" />
                        {item.email}
                      </span>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />

        <StatusBar>
          <div>
            <span>Users: {users.length}</span>
            {searchText && <span>Filter: {filteredUsers.length}</span>}
          </div>
        </StatusBar>
      </Wrapper>
    );
  }
}

export default connect(
  state => {
    return {
      ...state.users
    };
  },
  {
    getUsersAction
  }
)(UsersPage);
