const theme = {
    colors: {
        primary: '#0077cc', // Màu chủ đạo (biển xanh du lịch)
        secondary: '#ff7f50', // Màu phụ (cam nắng, năng động)
        accent: '#00b894', // Màu nhấn (xanh lá, thiên nhiên)
        background: '#f9f9f9', // Màu nền
        surface: '#ffffff', // Thẻ trắng
        text: '#333333', // Văn bản chính
        muted: '#666666', // Văn bản phụ
        border: '#e0e0e0', // Viền
        error: '#e74c3c', // Thông báo lỗi
        success: '#2ecc71', // Thành công
        warning: '#f39c12', // Cảnh báo
        info: '#3498db', // Thông tin
        gradient: {
            primary: 'linear-gradient(to right, #0077cc, #00b894)',
            secondary: 'linear-gradient(to right, #ff7f50, #ffbe76)'
        }
    },
    fontSizes: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '24px',
        xxl: '36px',
        xxxl: '48px'
    },

    fonts: {
        heading: `'Montserrat', 'Poppins', sans-serif`,
        body: `'Roboto', 'Open Sans', sans-serif`,
    },

    spacing: {
        xxs: '2px',
        xs: '4px',
        sm: '8px',
        base: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        xxxl: '64px',
    },

    breakpoints: {
        mobile: '480px',
        tablet: '768px',
        laptop: '1024px',
        desktop: '1280px',
        wide: '1440px'
    },

    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        round: '50%',
    },

    shadows: {
        sm: '0 1px 3px rgba(0,0,0,0.1)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 20px rgba(0,0,0,0.15)',
        xl: '0 14px 28px rgba(0,0,0,0.25)',
        hover: '0 10px 15px rgba(0,119,204,0.2)',
    },

    animations: {
        fast: '0.2s',
        normal: '0.3s',
        slow: '0.5s'
    },

    maxWidth: {
        content: '1400px',
        text: '700px'
    },

    grid: {
        columns: 12,
        gap: '16px'
    }
};

export default theme;