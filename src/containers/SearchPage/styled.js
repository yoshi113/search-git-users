import styled from 'styled-components';

export default styled.div`
  margin-top: 45px;
  margin-bottom: 25px;
  padding: 25px 50px;

  header {
    margin-bottom: 15px;

    .field-group {
      display: flex;

      > div {
        display: flex;
        align-items: center;
        label {
          margin-right: 10px;
        }
        & + div {
          margin-left: 20px;
        }
      }
    }

    .ant-progress {
      margin-top: 5px;
    }
  }

  .user-id {
    margin-right: 10px;
    font-size: 18px;
    color: #1890ff;
    &:hover {
      text-decoration: underline;
    }

    &.not-email {
      color: #f5222d;
    }
  }

  .user-name {
    font-size: 16px;
  }

  .ant-list-item-meta-description {
    font-size: 12px;
    span {
      i {
        margin-right: 5px;
      }
    }

    span + span {
      margin-left: 20px;
    }
  }

  .user-info {
    span + span {
      margin-left: 0;
      &:before {
        content: '|';
        margin: 0 10px;
      }
    }
  }

  .ant-pagination {
    margin-top: 15px;
    text-align: center;
  }
`;
