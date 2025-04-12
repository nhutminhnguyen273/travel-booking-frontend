import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import contactService from '../../services/contactService';

const PageWrapper = styled.div`
  width: 100%;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: ${props => props.theme.maxWidth.content};
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxl};
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  font-family: ${props => props.theme.fonts.heading};
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  overflow: hidden;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.primary};
  color: white;
`;

const InfoTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-family: ${props => props.theme.fonts.heading};
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.base};

  svg {
    margin-top: 4px;
  }
`;

const InfoText = styled.div`
  h3 {
    font-size: ${props => props.theme.fontSizes.base};
    margin-bottom: ${props => props.theme.spacing.xs};
    font-weight: 600;
  }

  p {
    font-size: ${props => props.theme.fontSizes.sm};
    opacity: 0.9;
    line-height: 1.6;
  }
`;

const ContactForm = styled.form`
  padding: ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.base};
`;

const FormTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.base};
  font-family: ${props => props.theme.fonts.heading};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.base};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.base};
  transition: all ${props => props.theme.animations.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.base};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.base};
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
  transition: all ${props => props.theme.animations.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: 600;
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};
  margin-top: ${props => props.theme.spacing.sm};

  &:hover {
    background: ${props => props.theme.colors.accent};
    transform: translateY(-2px);
  }

  &:disabled {
    background: ${props => props.theme.colors.muted};
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.colors.success};
  background: ${props => props.theme.colors.success}10;
  padding: ${props => props.theme.spacing.base};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: ${props => props.theme.spacing.base};
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: ${props => props.theme.spacing.xs};
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);

    try {
      await contactService.createContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <Title>Liên hệ với chúng tôi</Title>
        <ContentWrapper>
          <ContactInfo>
            <InfoTitle>Thông tin liên hệ</InfoTitle>
            <InfoList>
              <InfoItem>
                <FaMapMarkerAlt />
                <InfoText>
                  <h3>Địa chỉ</h3>
                  <p>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
                </InfoText>
              </InfoItem>
              <InfoItem>
                <FaPhone />
                <InfoText>
                  <h3>Điện thoại</h3>
                  <p>1900 1234</p>
                  <p>0123 456 789</p>
                </InfoText>
              </InfoItem>
              <InfoItem>
                <FaEnvelope />
                <InfoText>
                  <h3>Email</h3>
                  <p>info@travelbooking.com</p>
                  <p>support@travelbooking.com</p>
                </InfoText>
              </InfoItem>
              <InfoItem>
                <FaClock />
                <InfoText>
                  <h3>Giờ làm việc</h3>
                  <p>Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                  <p>Thứ 7: 8:00 - 12:00</p>
                </InfoText>
              </InfoItem>
            </InfoList>
          </ContactInfo>

          <ContactForm onSubmit={handleSubmit}>
            <FormTitle>Gửi tin nhắn cho chúng tôi</FormTitle>

            <InputGroup>
              <Label htmlFor="name">Họ và tên *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="email">Email *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="subject">Tiêu đề *</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="message">Nội dung tin nhắn *</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </InputGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && (
              <SuccessMessage>
                Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!
              </SuccessMessage>
            )}

            <Button type="submit" disabled={loading}>
              <FaPaperPlane />
              {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </Button>
          </ContactForm>
        </ContentWrapper>
      </Container>
    </PageWrapper>
  );
};

export default Contact; 