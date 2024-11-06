import styled from "styled-components";

const FooterContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1rem 0; 
  background-color: #00425a;
  color: #FFF;
  text-align: center;
  z-index: 1;  
  bottom: 0;   
  left: 0;
`;

const List = styled.ul`
  padding: 0;
  margin: 0;
  display: flex;
  list-style: none;
`;

const ItemFromList = styled.li`
  padding: 0 2rem;
  display: inline-block;
  margin-top: 0.6rem;
  text-decoration: none;
  font-size: 1.5rem;
  list-style: none;
`;

function Footer() {
  return (
    <FooterContainer>
      <List>
        <ItemFromList>
          Este é um footer de exemplo
        </ItemFromList>
        <ItemFromList>
          Criado por Jean Carlos
        </ItemFromList>
      </List>
    </FooterContainer>
  );
}

export default Footer;