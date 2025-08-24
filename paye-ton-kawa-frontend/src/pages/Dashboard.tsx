import React from 'react';
import PrivateRoute from '@/components/routing/PrivateRoute';
import DashboardContent from '@/components/dashboard/DashboardContent';

const Dashboard: React.FC = () => {
  return (
      <PrivateRoute>
        <DashboardContent />
      </PrivateRoute>
  );
};

export default Dashboard;
