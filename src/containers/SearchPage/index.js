import React from 'react';
import { connect } from 'react-redux';
import { Spin, Select, List, Avatar, Button, Progress, Icon, Input, Alert, Modal } from 'antd';
import { getUsersAction } from '../../redux/users';
import { setSearchDataAction, searchUsersAction, getUsersInfoAction, sendEmailAction } from '../../redux/search';
import { formatNumber } from '../../utils/helper';
import { LoadingWrapper, StatusBar } from '../../components';
import Wrapper from './styled';

const confirm = Modal.confirm;
const Option = Select.Option;

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageSize: 10
    };
  }

  componentDidMount() {
    if (!this.props.loadingUsers && !this.props.users) {
      this.props.getUsersAction();
    }
  }

  searchUsers = () => {
    const { language, location } = this.props;
    this.props.searchUsersAction({
      language,
      location
    });
  };

  getUsersInfo = () => {
    const data = this.props.searchUsers.filter(user => !user.status).map(({ login }) => ({ login }));
    this.props.getUsersInfoAction(data);
  };

  sendEmail = () => {
    confirm({
      title: 'Do you want to send email?',
      onOk: () => {
        const users = [];
        this.props.searchUsers.forEach(user => {
          if (!user.status) {
            users.push({
              login: user.login,
              avatar: user.avatar,
              name: user.name,
              location: user.location,
              repos: user.repos,
              followers: user.followers,
              following: user.following,
              email: user.email
            });
          }
        });
        this.props.sendEmailAction(users);
      }
    });
  };

  onChangePage = pageNumber => {
    this.setState({ pageNumber });
  };

  onChangeLanguage = language => {
    this.props.setSearchDataAction({ language });
  };

  onChangeLocation = e => {
    this.props.setSearchDataAction({ location: e.target.value });
  };

  render() {
    const { users, language, location, loading, searchUsers, gettingStatus, sendingStatus } = this.props;
    const { pageNumber, pageSize } = this.state;

    if (!users) {
      return (
        <LoadingWrapper>
          <Spin size="large" />
        </LoadingWrapper>
      );
    }
    const userCount = searchUsers.length;
    const pageUsers = searchUsers.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    const sentCount = searchUsers.filter(user => user.status === 'sent' || user.status === 'sending').length;

    let progress;
    if (loading === 'getting') {
      progress = ((gettingStatus.success + gettingStatus.failed) / gettingStatus.total) * 100;
    } else if (loading === 'sending') {
      progress = ((sendingStatus.success + sendingStatus.failed) / sendingStatus.total) * 100;
    }

    let success, failed;
    if (sendingStatus.total) {
      success = sendingStatus.success;
      failed = sendingStatus.failed;
    } else if (gettingStatus.total) {
      success = gettingStatus.success;
      failed = gettingStatus.failed;
    }

    return (
      <Wrapper>
        <header>
          <div className="field-group">
            <div>
              <label>Language</label>
              <Select defaultValue={language} onChange={this.onChangeLanguage}>
                <Option value="javascript">JavaScript</Option>
              </Select>
            </div>
            <div>
              <label>Location</label>
              <Input
                placeholder="San Francisco, CA"
                allowClear
                defaultValue={location}
                onChange={this.onChangeLocation}
              />
            </div>
            <div>
              <Button icon="search" loading={loading === 'search'} disabled={loading} onClick={this.searchUsers}>
                {loading !== 'search' ? 'Search Users' : `${userCount} users`}
              </Button>
            </div>
            <div>
              <Button
                loading={loading === 'getting'}
                disabled={loading || !userCount || gettingStatus.completed}
                onClick={this.getUsersInfo}
              >
                Get Emails
              </Button>
            </div>
            <div>
              <Button
                type="primary"
                loading={loading === 'sending'}
                disabled={loading || !gettingStatus.completed || sendingStatus.completed}
                onClick={this.sendEmail}
              >
                Send Email
              </Button>
            </div>
          </div>

          {progress !== undefined && (
            <Progress percent={progress} format={percent => `${Math.floor(percent)}%`} status="active" />
          )}
        </header>

        <List
          dataSource={pageUsers}
          pagination={{
            total: userCount,
            onChange: this.onChangePage
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
                      className={`user-id ${item.email === '' ? 'not-email' : ''}`}
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
                    <div className={'user-info'}>
                      {item.repos !== undefined && <span>Repos: {formatNumber(item.repos)}</span>}
                      {item.followers !== undefined && <span>Followers: {formatNumber(item.followers)}</span>}
                      {item.following !== undefined && <span>Following: {formatNumber(item.following)}</span>}
                    </div>
                    <div>
                      {item.location && (
                        <span>
                          <Icon type="environment" />
                          {item.location}
                        </span>
                      )}
                      {item.email && (
                        <span>
                          <Icon type="mail" />
                          {item.email}
                        </span>
                      )}
                    </div>
                  </div>
                }
              />
              <div>
                {item.loading && <Icon type="loading" />}
                {item.status === 'sent' && (
                  <Alert
                    message="Already sent!"
                    type="success"
                    showIcon
                    banner
                    style={{ backgroundColor: 'initial' }}
                  />
                )}
                {item.status === 'sending' && (
                  <Alert message="Sent!" type="success" showIcon banner style={{ backgroundColor: 'initial' }} />
                )}
                {item.status === 'failed' && (
                  <Alert message="Failed!" type="error" showIcon banner style={{ backgroundColor: 'initial' }} />
                )}
              </div>
            </List.Item>
          )}
        />

        <StatusBar>
          <div>
            {!!userCount && <span>Users: {userCount}</span>}
            {!!sentCount && <span>Sent: {sentCount}</span>}
          </div>
          <div>
            {success !== undefined && (
              <span>
                <Icon type="check-circle" /> {success}
              </span>
            )}
            {failed !== undefined && (
              <span>
                <Icon type="close-circle" /> {failed}
              </span>
            )}
          </div>
        </StatusBar>
      </Wrapper>
    );
  }
}

export default connect(
  state => {
    return {
      ...state.users,
      ...state.search
    };
  },
  {
    getUsersAction,
    setSearchDataAction,
    searchUsersAction,
    getUsersInfoAction,
    sendEmailAction
  }
)(SearchPage);
