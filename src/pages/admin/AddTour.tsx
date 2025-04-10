import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import tourService from '../../services/tourService';
import { Tour, TourType, StatusTour } from '../../types/tour';
import { toast } from 'react-hot-toast';
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
  max-width: 800px;
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.base};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text};
  font-weight: 500;
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
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
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
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.base};
  margin-top: ${props => props.theme.spacing.lg};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? props.theme.colors.surface : props.theme.colors.primary};
  color: ${props => props.variant === 'secondary' ? props.theme.colors.text : 'white'};
  border: 1px solid ${props => props.variant === 'secondary' ? props.theme.colors.border : 'transparent'};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const DestinationInput = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ScheduleInput = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

interface Schedule {
    startDate: Date;
    endDate: Date;
}

interface ItineraryDay {
    day: number;
    title: string;
    description: string;
}

interface FormData {
    title: string;
    description: string;
    price: string;
    destination: string[];
    type: TourType;
    duration: string;
    schedules: Schedule[];
    maxPeople: string;
    remainingSeats: string;
    images: string[];
    itinerary: ItineraryDay[];
    status: StatusTour;
    isDeleted: boolean;
}

interface CreateTourData extends Omit<Tour, '_id'> {
    price: number;
    duration: number;
    maxPeople: number;
    remainingSeats: number;
}

const initialFormData: FormData = {
    title: '',
    description: '',
    price: '',
    destination: [],
    type: TourType.DOMESTIC,
    duration: '',
    schedules: [],
    maxPeople: '',
    remainingSeats: '',
    images: [],
    itinerary: [],
    status: StatusTour.Available,
    isDeleted: false
};

const AddTourContent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDestinationChange = (index: number, value: string) => {
    const newDestinations = [...formData.destination];
    newDestinations[index] = value;
    setFormData(prev => ({
      ...prev,
      destination: newDestinations
    }));
  };

  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      destination: [...prev.destination, '']
    }));
  };

  const removeDestination = (index: number) => {
    setFormData(prev => ({
      ...prev,
      destination: prev.destination.filter((_, i) => i !== index)
    }));
  };

  const handleScheduleChange = (index: number, field: 'startDate' | 'endDate', value: string) => {
    const newSchedules = [...formData.schedules];
    newSchedules[index] = {
      ...newSchedules[index],
      [field]: new Date(value)
    };
    setFormData(prev => ({
      ...prev,
      schedules: newSchedules
    }));
  };

  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { startDate: new Date(), endDate: new Date() }]
    }));
  };

  const removeSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index)
    }));
  };

  const handleItineraryChange = (index: number, field: 'day' | 'title' | 'description', value: string | number) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = {
      ...newItinerary[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      itinerary: newItinerary
    }));
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '' }]
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageUrls: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          imageUrls.push(imageUrl);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, imageUrl]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const tourData = {
            title: formData.title,
            description: formData.description,
            price: Number(formData.price),
            destination: formData.destination,
            type: formData.type,
            duration: Number(formData.duration),
            schedules: formData.schedules.map(schedule => ({
                startDate: schedule.startDate,
                endDate: schedule.endDate
            })),
            maxPeople: Number(formData.maxPeople),
            remainingSeats: Number(formData.remainingSeats),
            images: formData.images,
            itinerary: formData.itinerary.map(day => ({
                day: day.day,
                title: day.title,
                description: day.description
            })),
            status: formData.status,
            isDeleted: formData.isDeleted
        };

        await tourService.createTour(tourData);
        toast.success('Tour created successfully');
        navigate('/admin/tours');
    } catch (error) {
        console.error('Error creating tour:', error);
        toast.error('Failed to create tour');
    }
  };

  return (
    <Wrapper>
      <Heading>Thêm Tour Mới</Heading>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Tên tour *</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Mô tả *</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="price">Giá (VNĐ) *</Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="type">Loại tour *</Label>
          <Select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value={TourType.DOMESTIC}>Trong nước</option>
            <option value={TourType.INTERNATIONAL}>Quốc tế</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="duration">Thời gian (ngày) *</Label>
          <Input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="maxPeople">Số người tối đa *</Label>
          <Input
            type="number"
            id="maxPeople"
            name="maxPeople"
            value={formData.maxPeople}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="remainingSeats">Số ghế còn lại *</Label>
          <Input
            type="number"
            id="remainingSeats"
            name="remainingSeats"
            value={formData.remainingSeats}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Điểm đến *</Label>
          {formData.destination.map((dest, index) => (
            <Input
              key={index}
              type="text"
              value={dest}
              onChange={(e) => handleDestinationChange(index, e.target.value)}
              placeholder="Nhập điểm đến"
              required
            />
          ))}
          <Button type="button" onClick={addDestination}>
            Thêm điểm đến
          </Button>
        </FormGroup>
        
        <FormGroup>
          <Label>Lịch trình *</Label>
          {formData.schedules.map((schedule, index) => (
            <div key={index}>
              <Input
                type="datetime-local"
                value={schedule.startDate.toISOString().slice(0, 16)}
                onChange={(e) => handleScheduleChange(index, 'startDate', new Date(e.target.value).toISOString())}
                required
              />
              <Input
                type="datetime-local"
                value={schedule.endDate.toISOString().slice(0, 16)}
                onChange={(e) => handleScheduleChange(index, 'endDate', new Date(e.target.value).toISOString())}
                required
              />
              <Button type="button" onClick={() => removeSchedule(index)}>
                Xóa lịch trình
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addSchedule}>
            Thêm lịch trình
          </Button>
        </FormGroup>
        
        <FormGroup>
          <Label>Hình ảnh</Label>
          <Input
            type="text"
            value={formData.images.join(', ')}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              images: e.target.value.split(',').map(url => url.trim())
            }))}
            placeholder="Nhập URL hình ảnh, phân cách bằng dấu phẩy"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Lịch trình chi tiết</Label>
          {formData.itinerary.map((day, index) => (
            <div key={index}>
              <Input
                type="number"
                value={day.day}
                onChange={(e) => handleItineraryChange(index, 'day', Number(e.target.value))}
                placeholder="Số ngày"
                required
              />
              <Input
                type="text"
                value={day.title}
                onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                placeholder="Tiêu đề ngày"
                required
              />
              <TextArea
                value={day.description}
                onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                placeholder="Mô tả ngày"
                required
              />
              <Button type="button" onClick={() => removeItineraryDay(index)}>
                Xóa ngày
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addItineraryDay}>
            Thêm ngày
          </Button>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="status">Trạng thái *</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value={StatusTour.Available}>Còn chỗ</option>
            <option value={StatusTour.Unavailable}>Hết chỗ</option>
          </Select>
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ButtonGroup>
          <Button type="submit">Tạo tour</Button>
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => navigate('/admin/tours')}
            disabled={loading}
          >
            Hủy
          </Button>
        </ButtonGroup>
      </Form>
    </Wrapper>
  );
};

const AddTour: React.FC = () => {
  return (
    <ErrorBoundary>
      <AddTourContent />
    </ErrorBoundary>
  );
};

export default AddTour; 