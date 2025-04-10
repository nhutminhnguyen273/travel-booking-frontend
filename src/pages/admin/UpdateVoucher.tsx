import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import voucherService, { UpdateVoucherData } from '../../services/voucherService';
import tourService from '../../services/tourService';
import { Tour } from '../../types/tour';

const Wrapper = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.text};
`;

const Form = styled.form`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.md};
  max-width: 800px;
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.base};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.base};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};
  background: white;
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  option {
    color: ${props => props.theme.colors.text};
    background: white;
    padding: 8px;
  }
`;

const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text};
`;

const UpdateVoucher: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [formData, setFormData] = useState<UpdateVoucherData>({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    startDate: '',
    endDate: '',
    usageLimit: 1,
    applicableTours: [],
    isActive: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [voucherResponse, toursResponse] = await Promise.all([
          voucherService.getVoucherById(id!),
          tourService.getAllTours()
        ]);

        const voucher = voucherResponse.data;
        setFormData({
          code: voucher.code,
          discountType: voucher.discountType,
          discountValue: voucher.discountValue,
          minOrderValue: voucher.minOrderValue,
          maxDiscount: voucher.maxDiscount,
          startDate: new Date(voucher.startDate).toISOString().slice(0, 16),
          endDate: new Date(voucher.endDate).toISOString().slice(0, 16),
          usageLimit: voucher.usageLimit,
          applicableTours: voucher.applicableTours,
          isActive: voucher.isActive
        });
        setTours(toursResponse.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch voucher data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (name === 'applicableTours') {
      const select = e.target as HTMLSelectElement;
      const selectedTours = Array.from(select.selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        applicableTours: selectedTours
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await voucherService.updateVoucher(id!, formData);
      navigate('/admin/vouchers');
    } catch (err: any) {
      setError(err.message || 'Failed to update voucher');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Wrapper>
          <LoadingMessage>Loading voucher data...</LoadingMessage>
        </Wrapper>
      </AdminLayout>
    );
  }

  return (
    <Wrapper>
      <Header>
        <Title>Update Voucher</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="code">Voucher Code</Label>
          <Input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="discountType">Discount Type</Label>
          <Select
            id="discountType"
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            required
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="discountValue">Discount Value</Label>
          <Input
            type="number"
            id="discountValue"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            min="0"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="minOrderValue">Minimum Order Value</Label>
          <Input
            type="number"
            id="minOrderValue"
            name="minOrderValue"
            value={formData.minOrderValue}
            onChange={handleChange}
            min="0"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="maxDiscount">Maximum Discount</Label>
          <Input
            type="number"
            id="maxDiscount"
            name="maxDiscount"
            value={formData.maxDiscount}
            onChange={handleChange}
            min="0"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="usageLimit">Usage Limit</Label>
          <Input
            type="number"
            id="usageLimit"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleChange}
            min="1"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="applicableTours">Applicable Tours</Label>
          <Select
            id="applicableTours"
            name="applicableTours"
            multiple
            value={formData.applicableTours}
            onChange={handleChange}
            style={{ height: '150px' }}
          >
            {tours.map(tour => (
              <option key={tour._id} value={tour._id}>
                {tour.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>
            <Input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              style={{ width: 'auto', marginRight: '8px' }}
            />
            Active
          </Label>
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit" disabled={saving}>
          {saving ? 'Updating...' : 'Update Voucher'}
        </Button>
      </Form>
    </Wrapper>
  );
};

export default UpdateVoucher; 