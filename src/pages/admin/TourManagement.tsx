import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import tourService from '../../services/tourService';
import { Tour, StatusTour, TourType } from '../../types/tour';
import ErrorBoundary from '../../components/ErrorBoundary';

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.colors.background};
  min-height: 100vh;
`;

const Heading = styled.h1`
  font-size: ${(props) => props.theme.fontSizes.xl};
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
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
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    text-align: left;
    color: ${(props) => props.theme.colors.text};
  }

  th {
    background-color: ${(props) => props.theme.colors.background};
    font-weight: bold;
    color: ${(props) => props.theme.colors.primary};
  }

  tr:hover {
    background-color: ${(props) => props.theme.colors.background};
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
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    opacity: 0.9;
  }
`;

const StatusBadge = styled.span<{ status: StatusTour }>`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case StatusTour.Available:
        return props.theme.colors.success;
        return props.theme.colors.error;
      case StatusTour.Unavailable:
        return props.theme.colors.info;
      default:
        return props.theme.colors.text;
    }
  }};
  color: white;
`;

const TourManagementContent: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await tourService.getAllTours();
      console.log('API Response:', response);
      if (response.data && Array.isArray(response.data)) {
        setTours(response.data);
        setError(null);
      } else {
        console.error('Invalid response format:', response);
        setError('Dữ liệu tour không hợp lệ');
        setTours([]);
      }
    } catch (err: any) {
      console.error('Error fetching tours:', err);
      setError(err.message || 'Không thể tải danh sách tour');
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      try {
        await tourService.deleteTour(id);
        setTours(tours.filter(tour => tour._id !== id));
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Không thể xóa tour');
      }
    }
  };

  const handleEditTour = (id: string) => {
    navigate(`/admin/tours/edit/${id}`);
  };

  const handleAddTour = () => {
    navigate('/admin/tours/add');
  };

  if (loading) {
    return <Wrapper>Đang tải...</Wrapper>;
  }

  if (error) {
    return <Wrapper>Lỗi: {error}</Wrapper>;
  }

  if (!tours || tours.length === 0) {
    return <Wrapper>
      <Heading>Quản Lý Tour</Heading>
      <p>Không có tour nào.</p>
      <AddButton onClick={handleAddTour}>
        <FaUserPlus /> Thêm Tour
      </AddButton>
    </Wrapper>;
  }

  return (
    <Wrapper>
      <Heading>Quản Lý Tour</Heading>

      <AddButton onClick={handleAddTour}>
        <FaUserPlus /> Thêm Tour
      </AddButton>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên tour</th>
              <th>Loại tour</th>
              <th>Điểm đến</th>
              <th>Thời gian</th>
              <th>Số người</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour, index) => (
              <tr key={tour._id}>
                <td>{index + 1}</td>
                <td>{tour.title}</td>
                <td>{tour.type}</td>
                <td>{tour.destination.join(', ')}</td>
                <td>{tour.duration} ngày</td>
                <td>{tour.remainingSeats}/{tour.maxPeople}</td>
                <td>{tour.price.toLocaleString('vi-VN')} VNĐ</td>
                <td>
                  <StatusBadge status={tour.status}>
                    {tour.status}
                  </StatusBadge>
                </td>
                <td>
                  <ActionButton 
                    color={theme.colors.secondary}
                    onClick={() => handleEditTour(tour._id)}
                  >
                    <FaEdit /> Sửa
                  </ActionButton>
                  <ActionButton 
                    color={theme.colors.error}
                    onClick={() => handleDeleteTour(tour._id)}
                  >
                    <FaTrash /> Xoá
                  </ActionButton>
                </td>
              </tr>
            ))}
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