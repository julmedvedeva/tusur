import { Routes, Route, NavLink } from 'react-router-dom'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
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

function App() {
  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">Поликлиника</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/doctors">Врачи</Nav.Link>
              <Nav.Link as={NavLink} to="/patients">Пациенты</Nav.Link>
              <Nav.Link as={NavLink} to="/appointments">Приёмы</Nav.Link>
              <Nav.Link as={NavLink} to="/medical-records">Мед. записи</Nav.Link>
              <NavDropdown title="Анализы" id="analyses-dropdown">
                <NavDropdown.Item as={NavLink} to="/analyses-catalog">Справочник анализов</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/analyses">Анализы пациентов</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Назначения" id="prescriptions-dropdown">
                <NavDropdown.Item as={NavLink} to="/drugs">Лекарства</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/procedures">Процедуры</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to="/prescription-procedures">Назначения процедур</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Справочники" id="references-dropdown">
                <NavDropdown.Item as={NavLink} to="/diagnoses">Диагнозы</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/rooms">Кабинеты</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/specialties">Специальности</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to="/doctor-rooms">Расписание врачей</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
        </Routes>
      </Container>
    </>
  )
}

export default App
