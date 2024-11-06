import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center; /* centraliza o texto no Title */
`;

const Title = styled.h2`
  font-size: 2rem; /* Ajuste o tamanho da fonte conforme desejado */
  color: #333; /* Altere a cor conforme necessário */
`;

function Home() {
  return (
    <HomeContainer>
      <Title>Bem-vindo(a) ao sistema de cadastros φ</Title>
    </HomeContainer>
  );
}

export default Home;
