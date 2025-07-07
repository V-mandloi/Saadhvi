import { Table, Card, Button } from 'react-bootstrap';

export default function DoctorsTable({ doctors, onEdit, onDelete }) {
  if (!Array.isArray(doctors) || doctors.length === 0) {
    return (
      <Card className="shadow-sm border-0 rounded-4 p-4">
        <p className="text-muted text-center mb-0">No doctors found.</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 rounded-4">
      <Card.Body>
        <h5 className="mb-4 fw-semibold text-success">Doctor Records</h5>
        <div className="table-responsive">
          <Table hover bordered className="mb-0 align-middle">
            <thead className="table-light text-center">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Experience (Years)</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Hospital</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {doctors.map((doctor, index) => (
                <tr key={doctor._id || index}>
                  <td className="text-muted fw-bold">{index + 1}</td>
                  <td className="fw-semibold">{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.experience}</td>
                  <td>{doctor.contact}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.hospital}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => onEdit?.(doctor)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => onDelete?.(doctor._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}
