import React from 'react';
import axios from 'axios';
import { Spin, Alert, Button } from 'antd';
import { LoadingWrapper } from '../../components';

class AuthCallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const code = this.props.location.search.replace('?code=', '');
    axios
      .get(`/api/get-token?code=${code}`)
      .then(response => {
        axios.defaults.headers.common['Authorization'] = `token ${response.data.token}`;
        const path = localStorage.getItem('path');
        this.props.history.replace(path);
      })
      .catch(error => {
        this.setState({ error: error.response.data.error });
      });
  }

  render() {
    const { error } = this.state;
    return (
      <LoadingWrapper>
        {error ? (
          <div>
            <Alert message={error} type="error" showIcon />
            <br />
            <Button
              type="link"
              href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`}
            >
              <b>Retry Login</b>
            </Button>
          </div>
        ) : (
          <Spin size="large" />
        )}
      </LoadingWrapper>
    );
  }
}

export default AuthCallback;
