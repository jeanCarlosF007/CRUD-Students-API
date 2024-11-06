import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateStudent from './components/CreateStudent';
import ListStudents from './components/ListStudents';
import UpdateStudent from './components/UpdateStudent';
import ProtectedRoute from './components/ProtectedRoute';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
    scroll-behavior: smooth;
  }

  body {
    font-family: "Playfair Display", serif;
    font-size: 1.6rem;
    line-height: 1.6;
    background-color: #F2F8FF;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  width: 90%;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Header />
        <Content>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/students" element={<ListStudents />} />
            <Route path="/student/createstudent" element={<CreateStudent />} />
            <Route path="/students/:id/update" element={<UpdateStudent />} />
          </Routes>
        </Content>
        <Footer />
      </Router>
    </>
  );
}

export default App;
