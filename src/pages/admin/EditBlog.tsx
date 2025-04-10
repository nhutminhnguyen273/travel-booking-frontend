import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaSave, FaUpload, FaTrash } from 'react-icons/fa';
import { Blog, UpdateBlogData, BlogCategory, BlogStatus } from '../../types/blog';
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.base};
  background-color: ${props => props.theme.colors.muted};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const Form = styled.form`
  background: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.base};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
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
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary + '20'};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.text};
  background-color: white;
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary + '20'};
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
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary + '20'};
  }
`;

const TagsInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: white;
`;

const Tag = styled.span`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.primary + '20'};
  color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.sm};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TagInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  min-width: 100px;
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.text};
  background-color: transparent;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.base};
  margin-top: ${props => props.theme.spacing.lg};
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.success};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${props => props.theme.colors.muted};
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  background: ${props => props.theme.colors.error + '10'};
  padding: ${props => props.theme.spacing.base};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-bottom: ${props => props.theme.spacing.base};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xl};
`;

const ThumbnailPreview = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  overflow: hidden;
  max-width: 300px;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const ImageUploadContainer = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const ImagePreview = styled.div`
  width: 100%;
  max-width: 300px;
  height: 200px;
  border-radius: ${props => props.theme.borderRadius.sm};
  overflow: hidden;
  position: relative;
  background-color: ${props => props.theme.colors.background};
  border: 1px dashed ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.base};
  background-color: ${props => props.theme.colors.primary + '20'};
  color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  width: fit-content;

  &:hover {
    background-color: ${props => props.theme.colors.primary + '30'};
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.xs};
  right: ${props => props.theme.spacing.xs};
  background-color: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const EditBlog: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<UpdateBlogData>({
    title: '',
    content: '',
    summary: '',
    thumbnail: '',
    category: BlogCategory.TRAVEL,
    tags: [],
    status: BlogStatus.DRAFT
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isNewImage, setIsNewImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check authentication
    const token = authService.getToken();
    const user = authService.getUser();

    if (!token || !user || user.role !== 'admin') {
      setError('You need to be logged in as an admin to edit a blog');
      setLoading(false);
      return;
    }

    if (id) {
      fetchBlog();
    } else {
      setError('Blog ID is missing');
      setLoading(false);
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!id) return;
      
      const response = await blogService.getBlogById(id);
      setBlog(response);
      
      // Initialize form data with blog data
      setFormData({
        title: response.title,
        content: response.content,
        summary: response.summary,
        thumbnail: response.thumbnail,
        category: response.category,
        tags: response.tags || [],
        status: response.status
      });
      
      // Set image preview
      setImagePreview(response.thumbnail);
    } catch (error: any) {
      console.error('Error fetching blog:', error);
      setError(error.message || 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = formData.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...currentTags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setIsNewImage(true);
      
      // Store the file for later upload
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      thumbnail: ''
    }));
    setIsNewImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title?.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content?.trim()) {
      setError('Content is required');
      return;
    }
    
    if (!formData.summary?.trim()) {
      setError('Summary is required');
      return;
    }
    
    if (!formData.thumbnail) {
      setError('Thumbnail is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      if (!id) {
        setError('Blog ID is missing');
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('summary', formData.summary);
      formDataToSend.append('category', formData.category?.toString() || '');
      formDataToSend.append('status', formData.status?.toString() || '');
      
      // Append tags as JSON string
      formDataToSend.append('tags', JSON.stringify(formData.tags || []));
      
      // Append the image file if it's a new image
      if (isNewImage && formData.thumbnail instanceof File) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      } else if (typeof formData.thumbnail === 'string') {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      await blogService.updateBlog(id, formDataToSend);
      toast.success('Blog updated successfully');
      navigate('/admin/blogs');
    } catch (error: any) {
      console.error('Error updating blog:', error);
      setError(error.message || 'Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <LoadingSpinner>Loading...</LoadingSpinner>
      </Wrapper>
    );
  }

  if (error && !blog) {
    return (
      <Wrapper>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton onClick={() => navigate('/admin/blogs')}>
          <FaArrowLeft /> Back to Blogs
        </BackButton>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header>
        <Title>Edit Blog</Title>
        <BackButton onClick={() => navigate('/admin/blogs')}>
          <FaArrowLeft /> Back to Blogs
        </BackButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="summary">Summary</Label>
          <TextArea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Enter blog summary"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">Content</Label>
          <TextArea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter blog content"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <ImageUploadContainer>
            {imagePreview ? (
              <ImagePreview>
                <PreviewImage src={imagePreview} alt="Thumbnail preview" />
                <RemoveImageButton type="button" onClick={removeImage}>
                  <FaTrash />
                </RemoveImageButton>
              </ImagePreview>
            ) : (
              <UploadButton htmlFor="thumbnail-upload">
                <FaUpload /> Upload Thumbnail
              </UploadButton>
            )}
            <HiddenInput
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </ImageUploadContainer>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {Object.values(BlogCategory).map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {Object.values(BlogStatus).map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tags">Tags</Label>
          <TagsInput>
            {(formData.tags || []).map(tag => (
              <Tag key={tag}>
                {tag}
                <RemoveTagButton type="button" onClick={() => removeTag(tag)}>
                  ×
                </RemoveTagButton>
              </Tag>
            ))}
            <TagInput
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags and press Enter"
            />
          </TagsInput>
        </FormGroup>

        <ButtonGroup>
          <SubmitButton type="submit" disabled={saving}>
            <FaSave /> {saving ? 'Saving...' : 'Update Blog'}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </Wrapper>
  );
};

export default EditBlog;
