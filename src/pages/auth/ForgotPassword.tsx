import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope } from 'react-icons/fa';
import authService, { ForgotPasswordData } from '../../services/auth.service';

const ForgotPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ForgotPasswordForm = styled.form`
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

const Links = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

const StyledLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  margin: 0 5px;

  &:hover {
    text-decoration: underline;
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: ''
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

    try {
      await authService.forgotPassword(formData);
      setSuccess('Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gửi email thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <ForgotPasswordForm onSubmit={handleSubmit}>
        <Title>Quên mật khẩu</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <InputGroup>
          <Icon><FaEnvelope /></Icon>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
        </Button>
        <Links>
          <span>Nhớ mật khẩu?</span>
          <StyledLink to="/auth/login">Đăng nhập</StyledLink>
        </Links>
      </ForgotPasswordForm>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword; 