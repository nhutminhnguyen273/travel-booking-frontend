import { useState } from 'react';
import styled from 'styled-components';
import { FaBell, FaLock, FaLanguage, FaMoon } from 'react-icons/fa';

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
  margin-bottom: ${props => props.theme.spacing.base};
  font-family: ${props => props.theme.fonts.heading};
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.muted};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const SettingsCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.lg};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.base};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.base};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  svg {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.primary};
  }
`;

const CardTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const SettingItem = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text};
`;

const SettingDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.muted};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.muted};
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.base};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};

  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.colors.success};
  background: ${props => props.theme.colors.success}10;
  padding: ${props => props.theme.spacing.base};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    language: 'vi',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSettingChange = (setting: keyof typeof settings, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <PageWrapper>
      <Container>
        <Title>Cài đặt tài khoản</Title>
        <Subtitle>Tùy chỉnh trải nghiệm của bạn</Subtitle>

        <SettingsGrid>
          <SettingsCard>
            <CardHeader>
              <FaBell />
              <CardTitle>Thông báo</CardTitle>
            </CardHeader>

            <SettingItem>
              <SettingLabel>Thông báo qua email</SettingLabel>
              <SettingDescription>
                Nhận thông báo về đặt tour và khuyến mãi qua email
              </SettingDescription>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={e => handleSettingChange('emailNotifications', e.target.checked)}
                />
                <ToggleSlider />
              </Toggle>
            </SettingItem>

            <SettingItem>
              <SettingLabel>Thông báo đẩy</SettingLabel>
              <SettingDescription>
                Nhận thông báo trực tiếp trên trình duyệt
              </SettingDescription>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={e => handleSettingChange('pushNotifications', e.target.checked)}
                />
                <ToggleSlider />
              </Toggle>
            </SettingItem>
          </SettingsCard>

          <SettingsCard>
            <CardHeader>
              <FaLock />
              <CardTitle>Bảo mật</CardTitle>
            </CardHeader>

            <SettingItem>
              <SettingLabel>Đổi mật khẩu</SettingLabel>
              <SettingDescription>
                Cập nhật mật khẩu để bảo vệ tài khoản của bạn
              </SettingDescription>
              <Button onClick={() => alert('Tính năng đang được phát triển')}>
                Đổi mật khẩu
              </Button>
            </SettingItem>
          </SettingsCard>

          <SettingsCard>
            <CardHeader>
              <FaLanguage />
              <CardTitle>Ngôn ngữ</CardTitle>
            </CardHeader>

            <SettingItem>
              <SettingLabel>Ngôn ngữ hiển thị</SettingLabel>
              <SettingDescription>
                Chọn ngôn ngữ bạn muốn sử dụng
              </SettingDescription>
              <Select
                value={settings.language}
                onChange={e => handleSettingChange('language', e.target.value)}
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </Select>
            </SettingItem>
          </SettingsCard>

          <SettingsCard>
            <CardHeader>
              <FaMoon />
              <CardTitle>Giao diện</CardTitle>
            </CardHeader>

            <SettingItem>
              <SettingLabel>Chế độ tối</SettingLabel>
              <SettingDescription>
                Bật chế độ tối để giảm mỏi mắt khi sử dụng ban đêm
              </SettingDescription>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={e => handleSettingChange('darkMode', e.target.checked)}
                />
                <ToggleSlider />
              </Toggle>
            </SettingItem>
          </SettingsCard>
        </SettingsGrid>

        <Button
          style={{ maxWidth: '200px', margin: '2rem auto 0' }}
          onClick={handleSaveSettings}
        >
          Lưu cài đặt
        </Button>

        {showSuccess && (
          <SuccessMessage>
            Cài đặt đã được lưu thành công!
          </SuccessMessage>
        )}
      </Container>
    </PageWrapper>
  );
};

export default Settings; 