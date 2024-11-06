import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import styled from 'styled-components';

const HeaderContainer = styled.div`
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
  top: 0;
  left: 0;
`

const List = styled.ul`
  
`
const ItemFromList = styled.li`
  padding: 0 2rem;
  display: inline-block;
  margin-top: 0.6rem;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 1.7rem;
  list-style: none;
`
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

function Header() {
  return (
    <HeaderContainer>
      <nav>
        <List>
          <ItemFromList>
            <StyledLink to="/">Página Inicial</StyledLink>
          </ItemFromList>
          <ItemFromList>
            <StyledLink to="/students">Listar Usuários</StyledLink>
          </ItemFromList>
          <ItemFromList>
            <StyledLink to="/student/createstudent">Criar Usuário</StyledLink>
          </ItemFromList>
        </List>
      </nav>
    </HeaderContainer>
  );
}

export default Header;
