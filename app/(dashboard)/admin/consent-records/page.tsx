import React from 'react';
import { Metadata } from 'next';
import { getAllConsentRecords, getConsentStatistics } from '@/lib/consent-service';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { CalendarIcon, Download, Filter, PieChart, Search, UserIcon } from 'lucide-react';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Consent Records | Admin Dashboard',
  description: 'View and manage user cookie consent records',
};

/**
 * Admin page component for managing cookie consent records
 */
export default async function ConsentRecordsPage({
  searchParams,
}: {
  searchParams: { page?: string; type?: string; from?: string; to?: string; user_id?: string };
}) {
  // Parse query parameters
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const type = searchParams.type as 'all' | 'necessary' | 'custom' | undefined;
  const fromDate = searchParams.from;
  const toDate = searchParams.to;
  const userId = searchParams.user_id;

  // Fetch consent records
  const { data: records, count, error } = await getAllConsentRecords(page, 10, {
    consent_type: type,
    from_date: fromDate,
    to_date: toDate,
    user_id: userId,
  });

  // Fetch statistics
  const { data: stats, error: statsError } = await getConsentStatistics();

  // Calculate pagination
  const totalPages = count ? Math.ceil(count / 10) : 0;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-gray-200 mb-6">Cookie Consent Records</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Records Card */}
        <Card className="card-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200">Total Records</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        
        {/* Consent Types Card */}
        <Card className="card-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200">Consent Types</CardTitle>
            <CardDescription>Distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">All</span>
              <span className="font-medium text-primary">{stats?.by_type?.all || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Necessary Only</span>
              <span className="font-medium text-primary">{stats?.by_type?.necessary || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Custom</span>
              <span className="font-medium text-primary">{stats?.by_type?.custom || 0}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Preference Stats Card */}
        <Card className="col-span-1 md:col-span-2 card-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200">Preference Stats</CardTitle>
            <CardDescription>Percentage of users who enabled each preference</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Necessary</span>
                  <span className="font-medium text-primary">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Functional</span>
                  <span className="font-medium text-primary">
                    {stats?.total ? Math.round((stats.by_preference?.functional || 0) / stats.total * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Analytics</span>
                  <span className="font-medium text-primary">
                    {stats?.total ? Math.round((stats.by_preference?.analytics || 0) / stats.total * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Marketing</span>
                  <span className="font-medium text-primary">
                    {stats?.total ? Math.round((stats.by_preference?.marketing || 0) / stats.total * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Card className="card-dark mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-gray-200 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/admin/consent-records" className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="consent-type" className="text-sm text-gray-400 block mb-1">Consent Type</label>
              <Select name="type" defaultValue={type || ''}>
                <SelectTrigger className="w-full bg-secondary-foreground/10 border-gray-700 text-gray-300">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="all">All Cookies</SelectItem>
                  <SelectItem value="necessary">Necessary Only</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="from-date" className="text-sm text-gray-400 block mb-1">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-secondary-foreground/10 border-gray-700 text-gray-300 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(new Date(fromDate), 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-secondary border-gray-700" align="start">
                  <Calendar
                    mode="single"
                    initialFocus
                    defaultMonth={fromDate ? new Date(fromDate) : undefined}
                    selected={fromDate ? new Date(fromDate) : undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label htmlFor="to-date" className="text-sm text-gray-400 block mb-1">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-secondary-foreground/10 border-gray-700 text-gray-300 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(new Date(toDate), 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-secondary border-gray-700" align="start">
                  <Calendar
                    mode="single"
                    initialFocus
                    defaultMonth={toDate ? new Date(toDate) : undefined}
                    selected={toDate ? new Date(toDate) : undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label htmlFor="user-id" className="text-sm text-gray-400 block mb-1">User ID</label>
              <div className="flex space-x-2">
                <Input
                  id="user-id"
                  name="user_id"
                  placeholder="User ID"
                  defaultValue={userId || ''}
                  className="bg-secondary-foreground/10 border-gray-700 text-gray-300"
                />
                <Button type="submit" variant="default">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Data Table */}
      <Card className="card-dark">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-200">Consent Records</CardTitle>
            <Button variant="outline" size="sm" className="border-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          <CardDescription>
            {count ? `Showing ${(page - 1) * 10 + 1} to ${Math.min(page * 10, count)} of ${count} records` : 'No records found'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">User</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Preferences</TableHead>
                <TableHead className="text-gray-400">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records && records.length > 0 ? (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-gray-300">
                      {record.created_at ? format(new Date(record.created_at), 'PPP HH:mm') : '-'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {record.user_id ? (
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-xs">{record.user_id.substring(0, 8)}...</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Anonymous</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.consent_type === 'all' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : record.consent_type === 'necessary'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}
                      >
                        {record.consent_type === 'all' 
                          ? 'All Cookies' 
                          : record.consent_type === 'necessary' 
                            ? 'Necessary Only' 
                            : 'Custom'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex space-x-1">
                        {Object.entries(record.preferences).map(([key, value]) => 
                          value && (
                            <span 
                              key={key}
                              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300"
                            >
                              {key.charAt(0).toUpperCase()}
                            </span>
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-400">
                      {record.ip_address || '-'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No consent records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            disabled={!hasPrevPage}
            onClick={() => {
              window.location.href = `/admin/consent-records?page=${page - 1}${type ? `&type=${type}` : ''}${fromDate ? `&from=${fromDate}` : ''}${toDate ? `&to=${toDate}` : ''}${userId ? `&user_id=${userId}` : ''}`;
            }}
            className="border-gray-700"
          >
            Previous
          </Button>
          <div className="text-sm text-gray-400">
            Page {page} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            disabled={!hasNextPage}
            onClick={() => {
              window.location.href = `/admin/consent-records?page=${page + 1}${type ? `&type=${type}` : ''}${fromDate ? `&from=${fromDate}` : ''}${toDate ? `&to=${toDate}` : ''}${userId ? `&user_id=${userId}` : ''}`;
            }}
            className="border-gray-700"
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
