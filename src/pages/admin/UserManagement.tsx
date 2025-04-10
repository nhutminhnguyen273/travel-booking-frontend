import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';

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
  }

  th {
    background-color: ${(props) => props.theme.colors.background};
    font-weight: bold;
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

  // Giả dữ liệu
  const users = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', role: 'Admin' },
    { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', role: 'User' },
    { id: 3, name: 'Lê Văn C', email: 'c@gmail.com', role: 'User' },
  ];

  return (
    <Wrapper>
      <Heading>Quản Lý Người Dùng</Heading>

      <AddButton>
        <FaUserPlus /> Thêm Người Dùng
      </AddButton>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Họ Tên</th>
              <th>Email</th>
              <th>Vai Trò</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <ActionButton color={theme.colors.secondary}>
                    <FaEdit /> Sửa
                  </ActionButton>
                  <ActionButton color={theme.colors.error}>
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