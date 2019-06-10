import React from 'react';
import axios from 'axios';
import { Button, Input, Icon, Progress, message } from 'antd';
import { StatusBar } from '../../components';
import { vaildEmail } from '../../utils/helper';
import Wrapper from './styled';

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  sendTestEmail = () => {
    // emails validation
    const emails = this.refEmails.input.value.split(',');
    const users = [];
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i].trim();
      if (email) {
        if (!vaildEmail(email)) {
          message.error('Invalid email address');
          return;
        }
        users.push({ email });
      }
    }
    if (!users.length) return;

    // send email
    let status = { success: 0, failed: 0 };
    this.setState({ sending: true, status });
    (async () => {
      for (let i = 0; i < users.length; i++) {
        const info = users[i];
        try {
          await axios.post('/api/add-user', { info });
          status.success++;
        } catch (error) {
          status.failed++;
        }
        this.setState({ status: { ...status } });
      }
      this.setState({ sending: false });
    })();
  };

  render() {
    const { sending, status } = this.state;
    return (
      <Wrapper>
        <div className="send-email">
          <Input
            ref={ref => {
              this.refEmails = ref;
            }}
            placeholder="email1@gmail.com, email2@hotmail.com, ..."
          />
          <Button key="submit" loading={sending} onClick={this.sendTestEmail}>
            Send Email
          </Button>
        </div>

        <StatusBar>
          <div>
            {status && (
              <span>
                <Icon type="check-circle" /> {status.success}
              </span>
            )}
            {status && (
              <span>
                <Icon type="close-circle" /> {status.failed}
              </span>
            )}
          </div>
        </StatusBar>
      </Wrapper>
    );
  }
}

export default TestPage;
