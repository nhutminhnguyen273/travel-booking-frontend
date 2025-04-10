import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../services/userService';
import { User } from '../../types/user';

const Wrapper = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const Heading = styled.h1`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Form = styled.form`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.sm};
  max-width: 600px;
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.base};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.text};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.text};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.base};
  margin-top: ${props => props.theme.spacing.lg};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? props.theme.colors.surface : props.theme.colors.primary};
  color: ${props => props.variant === 'secondary' ? props.theme.colors.text : 'white'};
  border: 1px solid ${props => props.variant === 'secondary' ? props.theme.colors.border : 'transparent'};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const LoadingMessage = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.base};
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
`;

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'customer',
    dateOfBirth: '',
    gender: 'male',
    isDeleted: false,
    password: ''
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.getUserById(id!);
      const userData = response.data;
      setUser(userData);
      setFormData({
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role,
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || 'male',
        isDeleted: userData.isDeleted,
        password: ''
      });
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await userService.updateUser(id!, formData as User);
      navigate('/admin/users');
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <Wrapper>
        <LoadingMessage>Đang tải thông tin người dùng...</LoadingMessage>
      </Wrapper>
    );
  }

  if (error && !user) {
    return (
      <Wrapper>
        <ErrorMessage>{error}</ErrorMessage>
        <ButtonGroup>
          <Button onClick={() => navigate('/admin/users')}>
            Quay lại
          </Button>
        </ButtonGroup>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Heading>Chỉnh Sửa Người Dùng</Heading>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="username">Tên đăng nhập *</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Mật khẩu mới (để trống nếu không thay đổi)</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="fullName">Họ và tên *</Label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email *</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="dateOfBirth">Ngày sinh</Label>
          <Input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="gender">Giới tính</Label>
          <Select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="role">Vai trò *</Label>
          <Select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="customer">Khách hàng</option>
            <option value="admin">Quản trị viên</option>
            <option value="tour_guide">Hướng dẫn viên</option>
          </Select>
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ButtonGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Cập nhật người dùng'}
          </Button>
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => navigate('/admin/users')}
            disabled={loading}
          >
            Hủy
          </Button>
        </ButtonGroup>
      </Form>
    </Wrapper>
  );
};

export default EditUser;
