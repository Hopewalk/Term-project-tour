import { render, screen, fireEvent } from '@testing-library/react';
import Category from './Component/Category/Category';
import fetchCategories from './Component/Category/fetchCategories';
import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons';

// Mock the fetchCategories function
jest.mock('./Component/Category/fetchCategories', () => jest.fn());

// Mock Ant Design Button with props tracking
jest.mock('antd', () => ({
    Button: ({ children, onClick, icon, color, variant, ...props }) => (
        <button
            onClick={onClick}
            data-color={color} // Add data attributes for testing
            data-variant={variant}
            {...props}
        >
            {icon}
            {children}
        </button>
    ),
}));

// Mock Ant Design icons
jest.mock('@ant-design/icons', () => ({
    EnvironmentOutlined: () => <span>EnvIcon</span>,
    HomeOutlined: () => <span>HomeIcon</span>,
}));

describe('Category Component', () => {
    const mockSetSelectedCategory = jest.fn();
    const mockCategories = [
        { icon: <EnvironmentOutlined />, label: 'One Day Trip', params: 'One Day Trip' },
        { icon: <HomeOutlined />, label: 'แพ็กเกจพร้อมที่พัก', params: 'Package with Accommodation' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        fetchCategories.mockResolvedValue(mockCategories);
    });

    test('renders categories after fetching', async () => {
        render(
            <Category setSelectedCategory={mockSetSelectedCategory} selectedCategory="" />
        );

        expect(await screen.findByText('One Day Trip')).toBeInTheDocument();
        expect(screen.getByText('แพ็กเกจพร้อมที่พัก')).toBeInTheDocument();
        expect(screen.getByText('EnvIcon')).toBeInTheDocument();
        expect(screen.getByText('HomeIcon')).toBeInTheDocument();
    });

    test('calls setSelectedCategory with correct params when button is clicked', async () => {
        render(
            <Category setSelectedCategory={mockSetSelectedCategory} selectedCategory="" />
        );

        const oneDayTripButton = await screen.findByText('One Day Trip');
        fireEvent.click(oneDayTripButton);

        expect(mockSetSelectedCategory).toHaveBeenCalledWith('One Day Trip');
    });

    test('toggles selectedCategory to empty string when same category is clicked', async () => {
        render(
            <Category setSelectedCategory={mockSetSelectedCategory} selectedCategory="One Day Trip" />
        );

        const oneDayTripButton = await screen.findByText('One Day Trip');
        fireEvent.click(oneDayTripButton);

        expect(mockSetSelectedCategory).toHaveBeenCalledWith('');
    });

    test('renders with correct number of buttons', async () => {
        render(
            <Category setSelectedCategory={mockSetSelectedCategory} selectedCategory="" />
        );

        const buttons = await screen.findAllByRole('button');
        expect(buttons).toHaveLength(2);
    });

    test('ensures buttons have correct styling based on selectedCategory', async () => {
        // Render with "One Day Trip" selected
        render(
            <Category setSelectedCategory={mockSetSelectedCategory} selectedCategory="One Day Trip" />
        );

        const oneDayTripButton = await screen.findByText('One Day Trip');
        const packageButton = await screen.findByText('แพ็กเกจพร้อมที่พัก');

        // Check selected button styling
        expect(oneDayTripButton).toHaveAttribute('data-color', 'primary');
        expect(oneDayTripButton).toHaveAttribute('data-variant', 'outlined');

        // Check unselected button styling
        expect(packageButton).toHaveAttribute('data-color', 'default');
        expect(packageButton).toHaveAttribute('data-variant', '');
    });
});