import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock } from 'react-icons/fa';
import authService from '../../services/authService';

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

const Links = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const StyledLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token không hợp lệ hoặc đã hết hạn');
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validatePassword = () => {
    if (formData.newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Token không hợp lệ hoặc đã hết hạn');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, {
        newPassword: formData.newPassword
      });
      
      setSuccess('Đặt lại mật khẩu thành công!');
      
      setTimeout(() => {
        navigate('/auth/login', { 
          state: { 
            type: 'success', 
            message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.' 
          } 
        });
      }, 2000);

    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.message || 
        'Không thể đặt lại mật khẩu. Vui lòng thử lại sau.'
      );
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
            minLength={6}
            disabled={loading}
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
            minLength={6}
            disabled={loading}
          />
        </InputGroup>
        
        <Button type="submit" disabled={loading || !token}>
          {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
        </Button>

        <Links>
          <StyledLink to="/auth/login">Quay về trang đăng nhập</StyledLink>
        </Links>
      </ResetPasswordForm>
    </ResetPasswordContainer>
  );
};

export default ResetPasswordPage; 