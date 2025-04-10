import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import tourService from '../../services/tourService';
import { Tour } from '../../types/tour';
import ErrorBoundary from '../../components/ErrorBoundary';
import authService from '../../services/authService';

const Wrapper = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const Heading = styled.h1`
  font-size: ${props => props.theme.fontSizes.xl};
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Form = styled.form`
  background: ${props => props.theme.colors.surface};
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
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};
  min-height: 100px;
`;

const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: bold;
  margin-top: ${props => props.theme.spacing.base};

  &:hover {
    opacity: 0.9;
  }
`;

const ArrayInputContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.base};
`;

const ArrayInput = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const RemoveButton = styled.button`
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
`;

const AddButton = styled.button`
  background: ${props => props.theme.colors.success};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  margin-top: ${props => props.theme.spacing.sm};
`;

const ItineraryDay = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.base};
  margin-bottom: ${props => props.theme.spacing.base};
`;

interface ImageFiles {
  image?: File;
  gallery: File[];
}

const EditTourContent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Tour>>({
    name: '',
    description: '',
    image: '',
    gallery: [''],
    duration: '',
    location: '',
    groupSize: 0,
    remainingSeats: 0,
    rating: 0,
    price: 0,
    includes: [''],
    excludes: [''],
    itinerary: [{ day: '', title: '', description: '' }],
    isDeleted: false
  });

  const [imageFiles, setImageFiles] = useState<ImageFiles>({
    gallery: []
  });

  useEffect(() => {
    // Check authentication when component mounts
    const token = authService.getToken();
    const user = authService.getUser();
    console.log('=== Authentication Debug ===');
    console.log('Token:', token);
    console.log('User from localStorage:', user);
    console.log('User Role:', user?.role);
    console.log('Is Admin:', user?.role === 'admin');
    console.log('===========================');

    if (!token || !user || user.role !== 'admin') {
      setError('You need to be logged in as an admin to access this page');
      return;
    }

    // Fetch tour data if we have an ID
    if (id) {
      fetchTourData();
    }
  }, [id]);

  const fetchTourData = async () => {
    try {
      setIsLoading(true);
      const tour = await tourService.getTourById(id!);
      console.log('Fetched tour data:', tour);
      setFormData(tour);
    } catch (error: any) {
      console.error('Error fetching tour:', error);
      setError(error.message || 'Failed to fetch tour data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Store the file
        setImageFiles(prev => ({
          ...prev,
          image: file
        }));

        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        setFormData(prev => ({
          ...prev,
          image: previewUrl
        }));
      } catch (err: any) {
        setError(err.message || 'Error handling image');
      }
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      try {
        const fileArray = Array.from(files);
        
        // Store the files
        setImageFiles(prev => ({
          ...prev,
          gallery: fileArray
        }));

        // Create preview URLs
        const previewUrls = fileArray.map(file => URL.createObjectURL(file));
        setFormData(prev => ({
          ...prev,
          gallery: previewUrls
        }));
      } catch (err: any) {
        setError(err.message || 'Error handling gallery images');
      }
    }
  };

  const handleArrayChange = (field: 'includes' | 'excludes', index: number, value: string) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleAddArrayItem = (field: 'includes' | 'excludes') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const handleRemoveArrayItem = (field: 'includes' | 'excludes', index: number) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleItineraryChange = (index: number, field: 'day' | 'title' | 'description', value: string) => {
    const newItinerary = [...(formData.itinerary || [])];
    newItinerary[index] = {
      ...newItinerary[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      itinerary: newItinerary
    }));
  };

  const handleAddItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), { day: '', title: '', description: '' }]
    }));
  };

  const handleRemoveItineraryDay = (index: number) => {
    const newItinerary = [...(formData.itinerary || [])];
    newItinerary.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      itinerary: newItinerary
    }));
  };

  const handleUpdateTour = async () => {
    const token = authService.getToken();
    const user = authService.getUser();
    
    if (!token) {
      setError('You need to be logged in to update a tour');
      return;
    }

    if (!user || user.role !== 'admin') {
      setError('You need to be an admin to update a tour');
      return;
    }

    if (!id) {
      setError('Tour ID is missing');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Create the tour data with default values
      const tourData: Partial<Tour> = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        location: formData.location,
        groupSize: formData.groupSize,
        remainingSeats: formData.remainingSeats,
        rating: formData.rating,
        includes: formData.includes,
        excludes: formData.excludes,
        itinerary: formData.itinerary,
        isDeleted: formData.isDeleted
      };

      // Update the tour with the image files
      const response = await tourService.updateTour(id, tourData, imageFiles);
      
      console.log('Tour updated successfully:', response);
      navigate('/admin/tours');
    } catch (error: any) {
      console.error('Error updating tour:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        authService.logout();
      } else {
        setError(error.response?.data?.message || 'Failed to update tour. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Heading>Loading tour data...</Heading>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Heading>Edit Tour</Heading>
      <Form>
        <FormGroup>
          <Label>Tour Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Tour Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {formData.image && formData.image !== '' && (
            <img 
              src={formData.image} 
              alt="Tour preview" 
              style={{ maxWidth: '200px', marginTop: '10px' }} 
            />
          )}
        </FormGroup>

        <FormGroup>
          <Label>Gallery Images</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {formData.gallery?.filter(url => url && url !== '').map((url, index) => (
              <img 
                key={index}
                src={url} 
                alt={`Gallery ${index + 1}`} 
                style={{ maxWidth: '200px' }} 
              />
            ))}
          </div>
        </FormGroup>

        <FormGroup>
          <Label>Duration</Label>
          <Input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Location</Label>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Price</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Group Size</Label>
          <Input
            type="number"
            name="groupSize"
            value={formData.groupSize}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Includes</Label>
          <ArrayInputContainer>
            {(formData.includes || []).map((item, index) => (
              <ArrayInput key={index}>
                <Input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('includes', index, e.target.value)}
                  placeholder="Enter included item"
                />
                <RemoveButton onClick={() => handleRemoveArrayItem('includes', index)}>
                  Remove
                </RemoveButton>
              </ArrayInput>
            ))}
            <AddButton onClick={() => handleAddArrayItem('includes')}>
              Add Include Item
            </AddButton>
          </ArrayInputContainer>
        </FormGroup>

        <FormGroup>
          <Label>Excludes</Label>
          <ArrayInputContainer>
            {(formData.excludes || []).map((item, index) => (
              <ArrayInput key={index}>
                <Input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('excludes', index, e.target.value)}
                  placeholder="Enter excluded item"
                />
                <RemoveButton onClick={() => handleRemoveArrayItem('excludes', index)}>
                  Remove
                </RemoveButton>
              </ArrayInput>
            ))}
            <AddButton onClick={() => handleAddArrayItem('excludes')}>
              Add Exclude Item
            </AddButton>
          </ArrayInputContainer>
        </FormGroup>

        <FormGroup>
          <Label>Itinerary</Label>
          {(formData.itinerary || []).map((day, index) => (
            <ItineraryDay key={index}>
              <FormGroup>
                <Label>Day {index + 1}</Label>
                <Input
                  type="text"
                  value={day.day}
                  onChange={(e) => handleItineraryChange(index, 'day', e.target.value)}
                  placeholder="Enter day number"
                />
              </FormGroup>
              <FormGroup>
                <Label>Title</Label>
                <Input
                  type="text"
                  value={day.title}
                  onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                  placeholder="Enter day title"
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={day.description}
                  onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                  placeholder="Enter day description"
                />
              </FormGroup>
              <RemoveButton onClick={() => handleRemoveItineraryDay(index)}>
                Remove Day
              </RemoveButton>
            </ItineraryDay>
          ))}
          <AddButton onClick={handleAddItineraryDay}>
            Add Itinerary Day
          </AddButton>
        </FormGroup>

        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#ffebee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        <Button 
          type="button" 
          onClick={handleUpdateTour}
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Tour'}
        </Button>
      </Form>
    </Wrapper>
  );
};

const EditTour: React.FC = () => {
  return (
    <ErrorBoundary>
      <EditTourContent />
    </ErrorBoundary>
  );
};

export default EditTour;
