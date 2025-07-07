import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Table } from 'react-bootstrap';

const TableRowSkeleton = () => (
  <tr>
    <td><Skeleton /></td>
    <td><Skeleton /></td>
    <td><Skeleton /></td>
    <td><Skeleton /></td>
    <td><Skeleton height={30} width={100} /></td>
  </tr>
);

export default function TableSkeleton() {
  return (
    <SkeletonTheme baseColor="#e9ecef" highlightColor="#f8f9fa">
      <div className="card shadow-sm">
        <Table striped bordered hover responsive className="mb-0">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Package Name</th>
              <th>Associated Hospital</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </tbody>
        </Table>
      </div>
    </SkeletonTheme>
  );
}