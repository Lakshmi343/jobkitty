import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminJobApi } from '../../utils/jobApi';
import { toast } from 'sonner';
import { Button, Card, Table, Badge, Select, Input, Space, Typography, Modal, message, Image } from 'antd';
import {  SearchOutlined,  FilterOutlined,  ReloadOutlined,  EyeOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined,
  FilePdfOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    jobId: '',
    applicantId: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [cvModalVisible, setCvModalVisible] = useState(false);
  const [currentCv, setCurrentCv] = useState(null);


  const fetchApplications = async (params = {}) => {
    try {
      setLoading(true);
      const page = params.pagination?.current || pagination.current;
      const pageSize = params.pagination?.pageSize || pagination.pageSize;
      
      const response = await adminJobApi.fetchAllApplications({
        page,
        limit: pageSize,
        status: filters.status || undefined,
        jobId: filters.jobId || undefined,
        applicantId: filters.applicantId || undefined,
        search: filters.search || undefined,
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc',
        ...params.filters,
      });

   
      const responseData = response?.data || response || {};
      const apps = Array.isArray(responseData) ? responseData : (responseData.data || responseData.applications || []);
      const total = responseData.total || responseData.count || apps.length;

      setApplications(apps);
      setPagination({
        ...pagination,
        total,
        current: params.pagination?.current || 1,
        pageSize: params.pagination?.pageSize || 10,
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      console.log('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchApplications();
  }, []);

 
  const handleTableChange = (pagination, filters, sorter) => {
    const newFilters = { ...filters };
    
  
    if (sorter.field) {
      newFilters.sortBy = sorter.field;
      newFilters.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    }
    
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
    
    fetchApplications({
      pagination,
      filters: newFilters,
    });
  };


  const handleFilterChange = (name, value) => {
    const newFilters = {
      ...filters,
      [name]: value,
    };
    
    if (name === 'search' && !value) {
      delete newFilters.search;
    }
    
    setFilters(newFilters);
    
   
    const newPagination = { ...pagination, current: 1 };
    setPagination(newPagination);
    
    fetchApplications({
      pagination: newPagination,
      filters: newFilters,
    });
  };

  const handleSearch = (value) => {
    const newFilters = { ...filters, search: value, current: 1 };
    setFilters(newFilters);
    fetchApplications({ filters: newFilters, pagination: { ...pagination, current: 1 } });
  };

  
  const resetFilters = () => {
    const newFilters = {
      status: '',
      jobId: '',
      applicantId: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setFilters(newFilters);
    fetchApplications({ filters: newFilters, pagination: { ...pagination, current: 1 } });
  };

 
  const handleStatusChange = (value) => {
    handleFilterChange('status', value);
  };


  const handleStatusUpdate = async (applicationId, status) => {
    try {
      if (status === 'rejected') {
        setSelectedApp(applicationId);
        setRejectModalVisible(true);
        return;
      }
      
      // Call the API to approve/reject
      const endpoint = status === 'accepted' 
        ? `/api/v1/applications/admin/applications/${applicationId}/approve`
        : `/api/v1/applications/admin/applications/${applicationId}/reject`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: status === 'rejected' ? JSON.stringify({ reason: 'Rejected by admin' }) : undefined
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const result = await response.json();
      toast.success(`Application ${status} successfully`);
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    }
  };


  const updateApplicationStatus = async (applicationId, status, reason = '') => {
    try {
      const endpoint = status === 'accepted' 
        ? `/api/v1/applications/admin/applications/${applicationId}/approve`
        : `/api/v1/applications/admin/applications/${applicationId}/reject`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: status === 'rejected' ? JSON.stringify({ reason }) : undefined
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      const result = await response.json();
      toast.success(`Application ${status} successfully`);
      fetchApplications();
      setRejectModalVisible(false);
      setRejectReason('');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

 
  const columns = [
    {
      title: 'Applicant',
      dataIndex: ['applicant', 'fullname'],
      key: 'applicant',
      render: (_, record) => (
        <div>
          <div>{record.applicant?.fullname || 'N/A'}</div>
          <Text type="secondary">{record.applicant?.email || ''}</Text>
        </div>
      ),
    },
    {
      title: 'Job Title',
      dataIndex: ['job', 'title'],
      key: 'job',
      render: (_, record) => (
        <div>
          <div>{record.job?.title || 'N/A'}</div>
          <Text type="secondary">{record.job?.company?.name || 'N/A'}</Text>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: ['job', 'location'],
      key: 'location',
      render: (location) => location || 'N/A',
    },
    {
      title: 'CV',
      key: 'cv',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<FileTextOutlined />} 
          onClick={() => {
            setCurrentCv(record.cv);
            setCvModalVisible(true);
          }}
          disabled={!record.cv}
        >
          {record.cv ? 'View CV' : 'No CV'}
        </Button>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <div>
          <Badge 
            status={
              status === 'accepted' ? 'success' : 
              status === 'rejected' ? 'error' : 'processing'
            } 
            text={
              status === 'accepted' ? 'Approved' : 
              status === 'rejected' ? 'Rejected' : 'Pending'
            } 
          />
          {status === 'pending' && (
            <div style={{ marginTop: 8 }}>
              <Button 
                type="text" 
                size="small" 
                icon={<CheckCircleOutlined style={{ color: 'green' }} />} 
                onClick={() => handleStatusUpdate(record._id, 'accepted')}
              />
              <Button 
                type="text" 
                size="small" 
                danger 
                icon={<CloseCircleOutlined />} 
                onClick={() => handleStatusUpdate(record._id, 'rejected')}
              />
            </div>
          )}
        </div>
      ),
      render: (status) => {
        let statusObj = {
          pending: { text: 'Pending', color: 'orange', icon: <ClockCircleOutlined /> },
          accepted: { text: 'Accepted', color: 'green', icon: <CheckCircleOutlined /> },
          rejected: { text: 'Rejected', color: 'red', icon: <CloseCircleOutlined /> },
        }[status] || { text: 'Unknown', color: 'default' };

        return (
          <Badge
            status={statusObj.color}
            text={
              <span>
                {statusObj.icon} {statusObj.text}
              </span>
            }
          />
        );
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Accepted', value: 'accepted' },
        { text: 'Rejected', value: 'rejected' },
      ],
      filteredValue: filters.status ? [filters.status] : null,
    },
    {
      title: 'Applied On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/admin/applications/${record._id}`)}
          >
            View
          </Button>
          {record.status !== 'accepted' && (
            <Button 
              type="link" 
              onClick={() => handleStatusUpdate(record._id, 'accepted')}
            >
              Accept
            </Button>
          )}
          {record.status !== 'rejected' && (
            <Button 
              type="link" 
              danger 
              onClick={() => handleStatusUpdate(record._id, 'rejected')}
            >
              Reject
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Job Applications</Title>
      </div>
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by name or email"
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onPressEnter={() => handleSearch(filters.search)}
              allowClear
            />
          </div>
          <Select
            placeholder="Filter by status"
            className="w-[200px]"
            value={filters.status || undefined}
            onChange={handleStatusChange}
            allowClear
          >
            <Option value="pending">Pending</Option>
            <Option value="accepted">Accepted</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <Button onClick={resetFilters} icon={<ReloadOutlined />}>
            Reset Filters
          </Button>
        </div>
      </Card>
      <Card>
        <Table
          columns={columns}
          rowKey="_id"
          dataSource={applications}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} applications`,
          }}
          onChange={handleTableChange}
          scroll={{ x: true }}
        />
      </Card>
      <Modal
        title="Reject Application"
        open={rejectModalVisible}
        onOk={() => {
          if (!rejectReason.trim()) {
            message.error('Please provide a reason for rejection');
            return;
          }
          updateApplicationStatus(selectedApp, 'rejected', rejectReason);
        }}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason('');
        }}
        okText="Confirm Rejection"
        okButtonProps={{ danger: true }}
      >
        <p>Please provide a reason for rejecting this application:</p>
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="mt-2"
        />
      </Modal>
      <Modal
        title={
          <div className="flex justify-between items-center">
            <span>Applicant's CV</span>
            {currentCv && (
              <Button 
                type="primary" 
                icon={<FilePdfOutlined />}
                onClick={() => window.open(currentCv, '_blank')}
                className="flex items-center gap-1"
              >
                Download CV
              </Button>
            )}
          </div>
        }
        open={cvModalVisible}
        onCancel={() => setCvModalVisible(false)}
        footer={null}
        width={1000}
        className="cv-preview-modal"
      >
        {currentCv ? (
          <div className="mt-4">
            {currentCv.endsWith('.pdf') ? (
              <embed 
                src={`${process.env.REACT_APP_API_URL}${currentCv}`} 
                type="application/pdf" 
                width="100%" 
                height="600px" 
              />
            ) : (
              <Image
                src={`${process.env.REACT_APP_API_URL}${currentCv}`}
                alt="Applicant CV"
                style={{ width: '100%', height: 'auto' }}
              />
            )}
            <div className="mt-4 text-center">
              <Button 
                type="primary" 
                href={`${process.env.REACT_APP_API_URL}${currentCv}`} 
                target="_blank"
                rel="noopener noreferrer"
                icon={<FilePdfOutlined />}
              >
                Download CV
              </Button>
            </div>
          </div>
        ) : (
          <p>No CV available</p>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationsPage;
