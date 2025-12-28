import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Tasks from '../src/pages/Tasks';
import { AuthProvider } from '../src/context/AuthContext';
import api from '../src/services/api';

vi.mock('../src/services/api');

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Tasks Component', () => {
  it('should render tasks page', async () => {
    api.get.mockResolvedValue({
      data: {
        tasks: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });

    renderWithProviders(<Tasks />);

    await waitFor(() => {
      expect(screen.getByText('Task Management')).toBeInTheDocument();
    });
  });
});


