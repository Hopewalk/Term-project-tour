import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProvincesBar from './Component/Search/ProvinceBar/ProvincesBar';
import ax from './conf/ax';

// Mock the axios instance
jest.mock('./conf/ax', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe('ProvincesBar Component', () => {
  beforeEach(() => {
    // Mock window.open
    jest.spyOn(window, 'open').mockImplementation(() => {});

    // Mock API response
    ax.get.mockResolvedValue({
      data: {
        data: [
          { region: 'northern', province: 'เชียงใหม่' },
          { region: 'northern', province: 'เชียงราย' },
          { region: 'central', province: 'กรุงเทพมหานคร' },
        ],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('selecting a province calls onSelect and opens a new window with the correct URL', async () => {
    // Mock onSelect callback
    const mockOnSelect = jest.fn();

    // Render ProvincesBar
    render(<ProvincesBar onSelect={mockOnSelect} />);

    // Wait for the dropdown button to appear (after loading)
    const dropdownButton = await screen.findByRole('button', { name: /เลือกภาคและจังหวัด/i });

    // Open the dropdown
    fireEvent.click(dropdownButton);

    // Select the 'northern' region tab (first tab by default)
    const northernTab = await screen.findByRole('button', { name: /ภาคเหนือ/i });
    fireEvent.click(northernTab);

    // Select 'Chiang Mai' province
    const chiangMaiButton = await screen.findByRole('button', { name: /เชียงใหม่/i });
    fireEvent.click(chiangMaiButton);

    // Assertions
    // Check onSelect was called with ['northern', 'เชียงใหม่']
    expect(mockOnSelect).toHaveBeenCalledWith(['northern', 'เชียงใหม่']);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);

    // Check window.open was called with the correct URL (decoded)
    expect(window.open).toHaveBeenCalledTimes(1);
    const openArgs = window.open.mock.calls[0];
    console.log(openArgs); // Debug log to check the actual URL and other arguments

    const expectedUrl = '/tour/northern/เชียงใหม่'; // Expect decoded URL
    expect(openArgs[0]).toBe(expectedUrl);
    expect(openArgs[1]).toBe('_blank');
  });
});
