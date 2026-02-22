import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import './App.css'
import DoctorsTable from './components/DoctorsTable'
import PatientsTable from './components/PatientsTable'
import AppointmentsTable from './components/AppointmentsTable'
import DiagnosesTable from './components/DiagnosesTable'
import AnalysesCatalogTable from './components/AnalysesCatalogTable'
import AnalysesTable from './components/AnalysesTable'
import DrugsTable from './components/DrugsTable'
import ProceduresTable from './components/ProceduresTable'
import RoomsTable from './components/RoomsTable'
import SpecialtiesTable from './components/SpecialtiesTable'
import MedicalRecordsTable from './components/MedicalRecordsTable'
import DoctorRoomsTable from './components/DoctorRoomsTable'
import PrescriptionProceduresTable from './components/PrescriptionProceduresTable'
import SelectionsPage from './components/SelectionsPage'

function AppNavbar() {
  const location = useLocation();

  // Проверка активности dropdown меню
  const isAnalysesActive = ['/analyses-catalog', '/analyses'].includes(location.pathname);
  const isPrescriptionsActive = ['/drugs', '/procedures', '/prescription-procedures'].includes(location.pathname);
  const isReferencesActive = ['/diagnoses', '/rooms', '/specialties', '/doctor-rooms'].includes(location.pathname);

  // Для главной страницы подсвечиваем "Врачи"
  const isDoctorsActive = location.pathname === '/' || location.pathname === '/doctors';

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/">Поликлиника</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to="/doctors"
              end
              className={({ isActive }) => (isActive || isDoctorsActive ? 'active' : '')}
            >
              Врачи
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/patients"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Пациенты
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/appointments"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Приёмы
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/medical-records"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Мед. записи
            </Nav.Link>
            <NavDropdown
              title="Анализы"
              id="analyses-dropdown"
              className={isAnalysesActive ? 'active-dropdown' : ''}
            >
              <NavDropdown.Item
                as={NavLink}
                to="/analyses-catalog"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Справочник анализов
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/analyses"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Анализы пациентов
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title="Назначения"
              id="prescriptions-dropdown"
              className={isPrescriptionsActive ? 'active-dropdown' : ''}
            >
              <NavDropdown.Item
                as={NavLink}
                to="/drugs"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Лекарства
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/procedures"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Процедуры
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                as={NavLink}
                to="/prescription-procedures"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Назначения процедур
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title="Справочники"
              id="references-dropdown"
              className={isReferencesActive ? 'active-dropdown' : ''}
            >
              <NavDropdown.Item
                as={NavLink}
                to="/diagnoses"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Диагнозы
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/rooms"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Кабинеты
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/specialties"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Специальности
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                as={NavLink}
                to="/doctor-rooms"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Расписание врачей
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              as={NavLink}
              to="/selections"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Выборки
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  return (
    <>
      <AppNavbar />

      <Container>
        <Routes>
          <Route path="/" element={<DoctorsTable />} />
          <Route path="/doctors" element={<DoctorsTable />} />
          <Route path="/patients" element={<PatientsTable />} />
          <Route path="/appointments" element={<AppointmentsTable />} />
          <Route path="/medical-records" element={<MedicalRecordsTable />} />
          <Route path="/diagnoses" element={<DiagnosesTable />} />
          <Route path="/analyses-catalog" element={<AnalysesCatalogTable />} />
          <Route path="/analyses" element={<AnalysesTable />} />
          <Route path="/drugs" element={<DrugsTable />} />
          <Route path="/procedures" element={<ProceduresTable />} />
          <Route path="/prescription-procedures" element={<PrescriptionProceduresTable />} />
          <Route path="/rooms" element={<RoomsTable />} />
          <Route path="/specialties" element={<SpecialtiesTable />} />
          <Route path="/doctor-rooms" element={<DoctorRoomsTable />} />
          <Route path="/selections" element={<SelectionsPage />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
