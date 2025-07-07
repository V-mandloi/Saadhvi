import { Table, Card, Button } from 'react-bootstrap';

export default function HospitalsTable({ hospitals, onEdit, onDelete }) {
  if (!Array.isArray(hospitals) || hospitals.length === 0) {
    return (
      <Card className="shadow-sm border-0 rounded-4 p-4">
        <p className="text-muted text-center mb-0">No hospitals found.</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 rounded-4">
      <Card.Body>
        <h5 className="mb-4 fw-semibold text-primary">Hospital Records</h5>
        <div className="table-responsive">
          <Table hover bordered className="mb-0 align-middle">
            <thead className="table-light text-center">
              <tr>
                <th>#</th>
                <th>Hospital Name</th>
                <th>Specialization</th>
                <th>Reg. No.</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {hospitals.map((hospital, index) => (
                <tr key={hospital._id || index}>
                  <td className="text-muted fw-bold">{index + 1}</td>
                  <td className="fw-semibold">{hospital.name}</td>
                  <td>{hospital.specialization}</td>
                  <td>{hospital.registrationNumber}</td>
                  <td>{hospital.contact}</td>
                  <td>{hospital.email}</td>
                  <td>{hospital.address}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => onEdit?.(hospital)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => onDelete?.(hospital._id)}
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
