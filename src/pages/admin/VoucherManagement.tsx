import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import ErrorBoundary from '../../components/ErrorBoundary';
import authService from '../../services/authService';
import voucherService from '../../services/voucherService';

const Wrapper = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.text};
`;

const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: ${props => props.theme.spacing.base};
  text-align: left;
  background: ${props => props.theme.colors.primary};
  color: white;
  font-weight: 500;
`;

const Td = styled.td`
  padding: ${props => props.theme.spacing.base};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text};
  margin-right: ${props => props.theme.spacing.sm};
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.$isActive ? props.theme.colors.success + '20' : props.theme.colors.error + '20'};
  color: ${props => props.$isActive ? props.theme.colors.success : props.theme.colors.error};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.base};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-bottom: ${props => props.theme.spacing.base};
  border: 1px solid ${props => props.theme.colors.error + '30'};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text};
`;

interface Voucher {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
}

const VoucherManagementContent: React.FC = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        const user = authService.getUser();

        if (!token || !user || user.role !== 'admin') {
          navigate('/login');
          return;
        }

        await fetchVouchers();
      } catch (err) {
        setError('Authentication failed');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await voucherService.getAllVouchers();
      setVouchers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vouchers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this voucher?')) {
      return;
    }

    try {
      await voucherService.deleteVoucher(id);
      setVouchers(vouchers.filter(voucher => voucher._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete voucher');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discountType === 'percentage') {
      return `${voucher.discountValue}%`;
    }
    return formatCurrency(voucher.discountValue);
  };

  return (
    <Wrapper>
      <Header>
        <Title>Voucher Management</Title>
        <Button onClick={() => navigate('/admin/vouchers/add')}>
          <FaPlus /> Add New Voucher
        </Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <LoadingMessage>Loading vouchers...</LoadingMessage>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Code</Th>
              <Th>Discount</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>Status</Th>
              <Th>Min Order</Th>
              <Th>Max Discount</Th>
              <Th>Usage</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher._id}>
                <Td>{voucher.code}</Td>
                <Td>{formatDiscount(voucher)}</Td>
                <Td>{formatDate(voucher.startDate)}</Td>
                <Td>{formatDate(voucher.endDate)}</Td>
                <Td>
                  <StatusBadge $isActive={voucher.isActive}>
                    {voucher.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </Td>
                <Td>{formatCurrency(voucher.minOrderValue)}</Td>
                <Td>{formatCurrency(voucher.maxDiscount)}</Td>
                <Td>{voucher.usedCount}/{voucher.usageLimit}</Td>
                <Td>
                  <ActionButton onClick={() => navigate(`/admin/vouchers/edit/${voucher._id}`)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(voucher._id)}>
                    <FaTrash />
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Wrapper>
  );
};

const VoucherManagement: React.FC = () => {
  return (
    <ErrorBoundary>
      <VoucherManagementContent />
    </ErrorBoundary>
  );
};

export default VoucherManagement;
