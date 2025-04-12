import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import bookingService from '../../services/bookingService';
import { Booking, BookingStatus, PaymentStatus } from '../../types/booking';

const PageWrapper = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
`;

const Th = styled.th`
  padding: ${props => props.theme.spacing.base};
  text-align: left;
  background: ${props => props.theme.colors.primary};
  color: white;
  font-weight: 600;
`;

const Td = styled.td`
  padding: ${props => props.theme.spacing.base};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'pending':
        return props.theme.colors.warning;
      case 'confirmed':
        return props.theme.colors.success;
      case 'cancelled':
        return props.theme.colors.error;
      case 'paid':
        return props.theme.colors.success;
      case 'failed':
        return props.theme.colors.error;
      case 'refunded':
        return props.theme.colors.muted;
      default:
        return props.theme.colors.muted;
    }
  }};
  color: white;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'danger' | 'success' }>`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => {
    switch (props.variant) {
      case 'primary':
        return props.theme.colors.primary;
      case 'danger':
        return props.theme.colors.error;
      case 'success':
        return props.theme.colors.success;
    }
  }};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  margin-right: ${props => props.theme.spacing.xs};

  &:hover {
    opacity: 0.9;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        console.error("Unexpected response:", response.data);
        setBookings([]);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      await fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const handleUpdatePaymentStatus = async (id: string, paymentStatus: PaymentStatus) => {
    try {
      await bookingService.updatePaymentStatus(id, paymentStatus);
      await fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật trạng thái thanh toán');
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <PageWrapper>
      <Title>Quản lý đơn hàng</Title>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Tour</Th>
            <Th>Người dùng</Th>
            <Th>Tổng tiền</Th>
            <Th>Trạng thái</Th>
            <Th>Thanh toán</Th>
            <Th>Phương thức</Th>
            <Th>Thao tác</Th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <Td>{booking._id}</Td>
              <Td>{booking.tour}</Td>
              <Td>{booking.user}</Td>
              <Td>{(booking.totalPrice || booking.totalAmount).toLocaleString('vi-VN')}₫</Td>
              <Td>
                <StatusBadge status={booking.status}>
                  {booking.status === 'pending' && 'Đang chờ'}
                  {booking.status === 'confirmed' && 'Đã xác nhận'}
                  {booking.status === 'cancelled' && 'Đã hủy'}
                </StatusBadge>
              </Td>
              <Td>
                <StatusBadge status={booking.paymentStatus}>
                  {booking.paymentStatus === 'pending' && 'Chờ thanh toán'}
                  {booking.paymentStatus === 'paid' && 'Đã thanh toán'}
                  {booking.paymentStatus === 'failed' && 'Thanh toán thất bại'}
                  {booking.paymentStatus === 'refunded' && 'Đã hoàn tiền'}
                </StatusBadge>
              </Td>
              <Td>
                {booking.paymentMethod === 'vnpay' && 'VNPay'}
                {booking.paymentMethod === 'momo' && 'MoMo'}
                {booking.paymentMethod === 'stripe' && 'Stripe'}
              </Td>
              <Td>
                <ButtonGroup>
                  {booking.status === 'pending' && (
                    <>
                      <ActionButton
                        variant="success"
                        onClick={() => handleUpdateBookingStatus(booking._id, BookingStatus.CONFIRMED)}
                      >
                        <FaCheck /> Xác nhận
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        onClick={() => handleUpdateBookingStatus(booking._id, BookingStatus.CANCELLED)}
                      >
                        <FaTimes /> Hủy
                      </ActionButton>
                    </>
                  )}
                  {booking.paymentStatus === 'pending' && (
                    <ActionButton
                      variant="primary"
                      onClick={() => handleUpdatePaymentStatus(booking._id, PaymentStatus.PAID)}
                    >
                      <FaMoneyBillWave /> Đã thanh toán
                    </ActionButton>
                  )}
                </ButtonGroup>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageWrapper>
  );
};

export default BookingManagement; 