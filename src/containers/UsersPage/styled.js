import styled from 'styled-components';

export default styled.div`
  margin-top: 45px;
  margin-bottom: 25px;
  padding: 25px 50px;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .user-id {
    margin-right: 10px;
    font-size: 18px;
    color: #1890ff;
    &:hover {
      text-decoration: underline;
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
