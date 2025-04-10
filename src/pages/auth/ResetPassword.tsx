import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock } from 'react-icons/fa';
import authService, { ResetPasswordData } from '../../services/auth.service';

const ResetPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ResetPasswordForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Icon = styled.span`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #764ba2;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: #00C851;
  text-align: center;
  margin-bottom: 1rem;
`;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [formData, setFormData] = useState<ResetPasswordData>({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      setLoading(false);
      return;
    }

    try {
      if (!token) throw new Error('Token không hợp lệ');
      await authService.resetPassword(token, formData);
      setSuccess('Mật khẩu đã được đặt lại thành công');
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResetPasswordContainer>
      <ResetPasswordForm onSubmit={handleSubmit}>
        <Title>Đặt lại mật khẩu</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <InputGroup>
          <Icon><FaLock /></Icon>
          <Input
            type="password"
            name="newPassword"
            placeholder="Mật khẩu mới"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Icon><FaLock /></Icon>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
        </Button>
      </ResetPasswordForm>
    </ResetPasswordContainer>
  );
};

export default ResetPassword; 