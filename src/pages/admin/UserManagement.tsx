import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import userService from '../../services/userService';
import { User } from '../../types/user';

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

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(user => user._id !== id));
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Không thể xóa người dùng');
      }
    }
  };

  const handleEditUser = (id: string) => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleAddUser = () => {
    navigate('/admin/users/add');
  };

  if (loading) {
    return <Wrapper>Đang tải...</Wrapper>;
  }

  if (error) {
    return <Wrapper>Lỗi: {error}</Wrapper>;
  }

  if (!users || users.length === 0) {
    return <Wrapper>
      <Heading>Quản Lý Người Dùng</Heading>
      <p>Không có người dùng nào.</p>
      <AddButton onClick={handleAddUser}>
        <FaUserPlus /> Thêm Người Dùng
      </AddButton>
    </Wrapper>;
  }

  return (
    <Wrapper>
      <Heading>Quản Lý Người Dùng</Heading>

      <AddButton onClick={handleAddUser}>
        <FaUserPlus /> Thêm Người Dùng
      </AddButton>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên đăng nhập</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <ActionButton 
                    color={theme.colors.secondary}
                    onClick={() => handleEditUser(user._id)}
                  >
                    <FaEdit /> Sửa
                  </ActionButton>
                  <ActionButton 
                    color={theme.colors.error}
                    onClick={() => handleDeleteUser(user._id)}
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

export default UserManagement;