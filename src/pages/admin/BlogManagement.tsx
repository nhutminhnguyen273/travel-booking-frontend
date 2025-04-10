import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { Blog, BlogCategory, BlogStatus } from '../../types/blog';
import blogService from '../../services/blogService';
import authService from '../../services/authService';

const Wrapper = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xl};
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.primary};
`;

const AddButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.base};
  background-color: ${props => props.theme.colors.success};
  color: white;
  border-radius: ${props => props.theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  padding: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.base};
`;

const SearchIcon = styled(FaSearch)`
  color: ${props => props.theme.colors.text};
  margin-right: ${props => props.theme.spacing.sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.primary};
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: ${props => props.theme.colors.background};
  }

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.base};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.base};
  text-align: left;
  font-weight: 600;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.primary};
  margin-right: ${props => props.theme.spacing.sm};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const DeleteButton = styled(ActionButton)`
  color: ${props => props.theme.colors.error};
`;

const StatusBadge = styled.span<{ status: BlogStatus }>`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 600;
  background-color: ${props => {
    switch (props.status) {
      case BlogStatus.PUBLISHED:
        return props.theme.colors.success + '20';
      case BlogStatus.DRAFT:
        return props.theme.colors.warning + '20';
      case BlogStatus.ARCHIVED:
        return props.theme.colors.error + '20';
      default:
        return props.theme.colors.muted + '20';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case BlogStatus.PUBLISHED:
        return props.theme.colors.success;
      case BlogStatus.DRAFT:
        return props.theme.colors.warning;
      case BlogStatus.ARCHIVED:
        return props.theme.colors.error;
      default:
        return props.theme.colors.text;
    }
  }};
`;

const CategoryBadge = styled.span<{ category: BlogCategory }>`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 600;
  background-color: ${props => props.theme.colors.primary + '20'};
  color: ${props => props.theme.colors.primary};
`;

const ThumbnailImage = styled.img`
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xl};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  background: ${props => props.theme.colors.error + '10'};
  padding: ${props => props.theme.spacing.base};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-bottom: ${props => props.theme.spacing.base};
`;

const BlogManagement: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check authentication
    const token = authService.getToken();
    const user = authService.getUser();

    if (!token || !user || user.role !== 'admin') {
      setError('You need to be logged in as an admin to access this page');
      return;
    }

    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogs();
      setBlogs(response.data);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      setError(error.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(id);
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } catch (error: any) {
        console.error('Error deleting blog:', error);
        toast.error(error.message || 'Failed to delete blog');
      }
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusText = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return 'Published';
      case BlogStatus.DRAFT:
        return 'Draft';
      case BlogStatus.ARCHIVED:
        return 'Archived';
      default:
        return status;
    }
  };

  const getCategoryText = (category: BlogCategory) => {
    switch (category) {
      case BlogCategory.NEWS:
        return 'News';
      case BlogCategory.TRAVEL:
        return 'Travel';
      case BlogCategory.TIPS:
        return 'Tips';
      case BlogCategory.REVIEWS:
        return 'Reviews';
      case BlogCategory.OTHER:
        return 'Other';
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <LoadingSpinner>Loading...</LoadingSpinner>
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
        <Title>Blog Management</Title>
        <AddButton to="/admin/blogs/add">
          <FaPlus /> Add New Blog
        </AddButton>
      </Header>

      <SearchBar>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      {filteredBlogs.length === 0 ? (
        <EmptyState>
          <h3>No blogs found</h3>
          <p>Try adjusting your search or add a new blog.</p>
        </EmptyState>
      ) : (
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>Thumbnail</TableHeaderCell>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Views</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {filteredBlogs.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>
                  <ThumbnailImage src={blog.thumbnail} alt={blog.title} />
                </TableCell>
                <TableCell>
                  <div>
                    <strong>{blog.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {blog.summary.substring(0, 50)}...
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <CategoryBadge category={blog.category}>
                    {getCategoryText(blog.category)}
                  </CategoryBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={blog.status}>
                    {getStatusText(blog.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell>{blog.viewCount}</TableCell>
                <TableCell>
                  <ActionButton onClick={() => navigate(`/admin/blogs/view/${blog._id}`)}>
                    <FaEye />
                  </ActionButton>
                  <ActionButton onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}>
                    <FaEdit />
                  </ActionButton>
                  <DeleteButton onClick={() => handleDelete(blog._id)}>
                    <FaTrash />
                  </DeleteButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </Wrapper>
  );
};

export default BlogManagement;
