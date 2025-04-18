import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import authService from '../../services/authService';
import contactService, { Contact } from '../../services/contactService';

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

const ContactList = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.base};
`;

const ContactCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const ContactHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.base};
`;

const ContactName = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ContactDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.muted};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const ContactInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.base};
  margin-bottom: ${props => props.theme.spacing.base};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
`;

const Message = styled.p`
  color: ${props => props.theme.colors.text};
  margin: ${props => props.theme.spacing.base} 0;
  line-height: 1.5;
`;

const StatusBadge = styled.span<{ isRead: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.isRead ? props.theme.colors.success : props.theme.colors.primary};
  color: white;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text};
  margin-right: ${props => props.theme.spacing.sm};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.base};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-bottom: ${props => props.theme.spacing.base};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text};
`;

const ContactManagementContent: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getUser();

    if (!token || !user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchContacts();
  }, [navigate]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAllContacts();
      setContacts(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách liên hệ');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    try {
      await contactService.updateContactStatus(id, newStatus);
      setContacts(contacts.map(contact => 
        contact._id === id ? { ...contact, status: newStatus } : contact
      ));
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) {
      return;
    }

    try {
      await contactService.deleteContact(id);
      setContacts(contacts.filter(contact => contact._id !== id));
    } catch (err: any) {
      setError(err.message || 'Không thể xóa liên hệ');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <LoadingMessage>Đang tải...</LoadingMessage>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <ErrorMessage>{error}</ErrorMessage>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header>
        <Title>Quản lý liên hệ</Title>
      </Header>
      <ContactList>
        {contacts.map((contact) => (
          <ContactCard key={contact._id}>
            <ContactHeader>
              <ContactName>{contact.name}</ContactName>
              <ContactDate>
                <FaCalendarAlt />
                {formatDate(contact.createdAt)}
              </ContactDate>
            </ContactHeader>

            <ContactInfo>
              <InfoItem>
                <FaEnvelope />
                {contact.email}
              </InfoItem>
              <InfoItem>
                <FaPhone />
                {contact.phone}
              </InfoItem>
              <InfoItem>
                <StatusBadge isRead={contact.status === 'completed'}>
                  {contact.status === 'completed' ? <FaCheck /> : <FaTimes />}
                  {getStatusText(contact.status)}
                </StatusBadge>
              </InfoItem>
            </ContactInfo>

            <Message>
              <strong>Tiêu đề:</strong> {contact.subject}
              <br />
              <strong>Nội dung:</strong> {contact.message}
            </Message>

            <div>
              {contact.status !== 'completed' && (
                <ActionButton onClick={() => handleUpdateStatus(contact._id, 'completed')}>
                  Đánh dấu đã xử lý
                </ActionButton>
              )}
              <ActionButton onClick={() => handleDelete(contact._id)}>
                Xóa
              </ActionButton>
            </div>
          </ContactCard>
        ))}
      </ContactList>
    </Wrapper>
  );
};

export default ContactManagementContent;
