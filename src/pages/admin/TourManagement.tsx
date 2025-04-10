import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import tourService from '../../services/tourService';
import { Tour } from '../../types/tour';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.colors.background};
  min-height: 100vh;
`;

const Heading = styled.h1`
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-family: ${(props) => props.theme.fonts.heading};
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const TableWrapper = styled.div`
  background: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.sm};
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: ${(props) => props.theme.spacing.sm};
    text-align: left;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }

  th {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    font-weight: bold;
  }

  td {
    color: ${(props) => props.theme.colors.text};
  }
`;

const ActionButton = styled.button<{ color: string }>`
  background: ${(props) => props.color};
  color: white;
  border: none;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  margin-right: ${(props) => props.theme.spacing.xs};

  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    opacity: 0.9;
  }
`;

const AddButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.base};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: bold;
  margin-bottom: ${(props) => props.theme.spacing.lg};

  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    opacity: 0.95;
  }
`;

const TourManagementContent: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      console.log('Fetching tours...');
      const response = await tourService.getAllTours();
      console.log('Received response:', response);
      const toursData = response.data;
      console.log('Tours data:', toursData);
      setTours(Array.isArray(toursData) ? toursData : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Failed to load tours');
      setLoading(false);
      setTours([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await tourService.deleteTour(id);
        setTours(tours.filter(tour => tour._id !== id));
      } catch (err) {
        setError('Failed to delete tour');
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/tours/edit/${id}`);
  };

  const handleAdd = () => {
    navigate('/admin/tours/add');
  };

  if (loading) {
    return (
      <Wrapper>
        <Heading>Loading tours...</Heading>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <Heading>{error}</Heading>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Heading>Tour Management</Heading>

      <AddButton onClick={handleAdd}>
        <FaPlus /> Add New Tour
      </AddButton>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Location</th>
              <th>Duration</th>
              <th>Group Size</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              console.log('Current tours state:', tours);
              console.log('Number of tours:', tours.length);
              return tours.length > 0 ? (
                tours.map((tour, index) => {
                  console.log('Rendering tour:', tour);
                  return (
                    <tr key={tour._id}>
                      <td>{index + 1}</td>
                      <td>{tour.name}</td>
                      <td>{tour.location}</td>
                      <td>{tour.duration}</td>
                      <td>{tour.groupSize}</td>
                      <td>{tour.rating}</td>
                      <td>
                        <ActionButton color={theme.colors.secondary} onClick={() => handleEdit(tour._id)}>
                          <FaEdit /> Edit
                        </ActionButton>
                        <ActionButton color={theme.colors.error} onClick={() => handleDelete(tour._id)}>
                          <FaTrash /> Delete
                        </ActionButton>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center' }}>No tours found</td>
                </tr>
              );
            })()}
          </tbody>
        </Table>
      </TableWrapper>
    </Wrapper>
  );
};

const TourManagement: React.FC = () => {
  return (
    <ErrorBoundary>
      <TourManagementContent />
    </ErrorBoundary>
  );
};

export default TourManagement;