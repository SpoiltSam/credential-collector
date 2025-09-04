'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RequestSummary {
  total: number;
  pending: number;
  submitted: number;
  expired: number;
}

export function AdminDashboard() {
  const [requestSummary, setRequestSummary] = useState<RequestSummary>({
    total: 0,
    pending: 0,
    submitted: 0,
    expired: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual data from Airtable API
    // For now, showing placeholder data
    setTimeout(() => {
      setRequestSummary({
        total: 12,
        pending: 3,
        submitted: 8,
        expired: 1,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requestSummary.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{requestSummary.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting submission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{requestSummary.submitted}</div>
            <p className="text-xs text-muted-foreground">Credentials received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{requestSummary.expired}</div>
            <p className="text-xs text-muted-foreground">Not submitted in time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest credential collection requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Placeholder data - will be replaced with real data */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-gray-500">john@company.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">3 services</Badge>
                <Badge variant="outline" className="text-yellow-600">Pending</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">sarah@startup.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">2 services</Badge>
                <Badge variant="outline" className="text-green-600">Submitted</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium">Mike Chen</p>
                  <p className="text-sm text-gray-500">mike@agency.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">5 services</Badge>
                <Badge variant="outline" className="text-green-600">Submitted</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-blue-600">Generate New Collection URL</h3>
              <p className="text-sm text-gray-500 mt-1">Create a new credential collection request</p>
            </button>
            
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-green-600">View Service Definitions</h3>
              <p className="text-sm text-gray-500 mt-1">Manage available services and their requirements</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}