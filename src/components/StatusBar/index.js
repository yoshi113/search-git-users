import styled from 'styled-components';

export default styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  width: 100%;
  height: 25px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: rgba(0, 21, 41, 0.75);
  z-index: 2;

  span {
    margin: 0 10px;
    i {
      margin-right: 5px;
    }
  }
`;
