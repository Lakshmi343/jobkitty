import React, { useState, useEffect, useRef } from 'react';

// job.location can be an object {state, district, legacy} — convert safely
const formatLocation = (loc) => {
  if (!loc) return '—';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') {
    const parts = [loc.district, loc.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  }
  return String(loc);
};
import { adminJobApi } from '../../utils/jobApi';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '../../utils/constant';
import { Button, Card, Table, Badge, Select, Input, Space, Typography, Modal, message } from 'antd';
import {
  SearchOutlined, FilterOutlined, ReloadOutlined, EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  DownloadOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  LinkOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

/* ─────────────────────────────────────────────────────────── */
/*  Applicant Detail Modal (pure CSS animations, no extra lib) */
/* ─────────────────────────────────────────────────────────── */
const ApplicantModal = ({ application, onClose }) => {
  const overlayRef = useRef(null);

  // Close on outside click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!application) return null;

  const { applicant, job, status, createdAt, cv } = application;
  const resumeUrl = applicant?.profile?.resume || cv || null;
  const resumeName = applicant?.profile?.resumeOriginalName || 'View Resume';

  const statusConfig = {
    accepted: { color: '#16a34a', bg: '#dcfce7', label: 'Accepted', icon: '✅' },
    rejected: { color: '#dc2626', bg: '#fee2e2', label: 'Rejected', icon: '❌' },
    pending: { color: '#d97706', bg: '#fef3c7', label: 'Pending', icon: '⏳' },
  };
  const s = statusConfig[status] || { color: '#6b7280', bg: '#f3f4f6', label: status, icon: '❓' };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform: scale(0.93) translateY(20px) }
                             to   { opacity:1; transform: scale(1)    translateY(0)    } }
        .modal-card { animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .info-row { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid #f1f5f9; }
        .info-row:last-child { border-bottom:none; }
        .info-icon { color:#6366f1; font-size:16px; margin-top:2px; flex-shrink:0; }
        .info-label { font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; margin-bottom:2px; }
        .info-value { font-size:14px; color:#1e293b; font-weight:500; }
        .section-title { font-size:12px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.08em; margin-bottom:4px; padding-bottom:6px; border-bottom:2px solid #e2e8f0; }
        .resume-btn { display:inline-flex; align-items:center; gap:8px; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; text-decoration:none; border:none; }
        .resume-view { background:#ede9fe; color:#7c3aed; }
        .resume-view:hover { background:#ddd6fe; color:#6d28d9; }
        .resume-dl { background:#6366f1; color:#fff; }
        .resume-dl:hover { background:#4f46e5; color:#fff; }
        .close-btn { position:absolute; top:16px; right:16px; width:32px; height:32px; border-radius:50%; border:none; background:#f1f5f9; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:18px; color:#64748b; transition:all .15s; }
        .close-btn:hover { background:#e2e8f0; color:#1e293b; transform:scale(1.1); }
        .avatar { width:56px; height:56px; border-radius:14px; background:linear-gradient(135deg,#6366f1,#8b5cf6); display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:700; color:#fff; flex-shrink:0; }
      `}</style>

      <div
        className="modal-card"
        style={{
          background: '#fff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        }}
      >
        {/* Close button */}
        <button className="close-btn" onClick={onClose}>×</button>

        {/* Header */}
        <div style={{
          padding: '28px 28px 20px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: '20px 20px 0 0',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="avatar">
              {(applicant?.fullname || '?')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                {applicant?.fullname || 'Unknown Applicant'}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>
                {applicant?.email || '—'}
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            position: 'absolute', top: '24px', right: '56px',
            background: s.bg,
            color: s.color,
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
          }}>
            {s.icon} {s.label}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }}>

          {/* Applicant Info */}
          <p className="section-title">👤 Applicant Details</p>
          <div style={{ marginBottom: '20px' }}>
            <div className="info-row">
              <UserOutlined className="info-icon" />
              <div>
                <div className="info-label">Full Name</div>
                <div className="info-value">{applicant?.fullname || '—'}</div>
              </div>
            </div>
            <div className="info-row">
              <MailOutlined className="info-icon" />
              <div>
                <div className="info-label">Email</div>
                <div className="info-value">{applicant?.email || '—'}</div>
              </div>
            </div>
            <div className="info-row">
              <PhoneOutlined className="info-icon" />
              <div>
                <div className="info-label">Phone Number</div>
                <div className="info-value">{applicant?.phoneNumber || '—'}</div>
              </div>
            </div>
          </div>

          {/* Job Info */}
          <p className="section-title">💼 Applied Position</p>
          <div style={{ marginBottom: '20px' }}>
            <div className="info-row">
              <FileTextOutlined className="info-icon" />
              <div>
                <div className="info-label">Job Title</div>
                <div className="info-value">{job?.title || '—'}</div>
              </div>
            </div>
            <div className="info-row">
              <BankOutlined className="info-icon" />
              <div>
                <div className="info-label">Company</div>
                <div className="info-value">{job?.company?.name || '—'}</div>
              </div>
            </div>
            <div className="info-row">
              <EnvironmentOutlined className="info-icon" />
              <div>
                <div className="info-label">Location</div>
                <div className="info-value">{formatLocation(job?.location)}</div>
              </div>
            </div>
            <div className="info-row">
              <CalendarOutlined className="info-icon" />
              <div>
                <div className="info-label">Applied On</div>
                <div className="info-value">
                  {createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Resume */}
          <p className="section-title">📄 Resume / CV</p>
          {resumeUrl ? (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-btn resume-view"
              >
                <LinkOutlined /> {resumeName}
              </a>
              <a
                href={resumeUrl}
                download
                className="resume-btn resume-dl"
              >
                <DownloadOutlined /> Download
              </a>
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              color: '#94a3b8', fontSize: '14px', padding: '10px 0'
            }}>
              <ExclamationCircleOutlined /> No resume uploaded by this applicant.
            </div>
          )}

          {/* Applicant Bio / Skills if available */}
          {applicant?.profile?.bio && (
            <>
              <p className="section-title" style={{ marginTop: '20px' }}>📝 About</p>
              <div style={{
                background: '#f8fafc', borderRadius: '10px', padding: '14px',
                fontSize: '13px', color: '#475569', lineHeight: '1.6'
              }}>
                {applicant.profile.bio}
              </div>
            </>
          )}

          {applicant?.profile?.skills?.length > 0 && (
            <>
              <p className="section-title" style={{ marginTop: '20px' }}>🛠 Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {applicant.profile.skills.map((skill, i) => (
                  <span key={i} style={{
                    background: '#ede9fe', color: '#7c3aed',
                    borderRadius: '999px', padding: '4px 12px',
                    fontSize: '12px', fontWeight: 600
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid #f1f5f9',
          borderRadius: '0 0 20px 20px',
          background: '#fafafa',
          textAlign: 'right',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 24px', borderRadius: '8px', border: 'none',
              background: '#6366f1', color: '#fff', fontWeight: 600,
              fontSize: '14px', cursor: 'pointer', transition: 'background .15s'
            }}
            onMouseOver={e => e.target.style.background = '#4f46e5'}
            onMouseOut={e => e.target.style.background = '#6366f1'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────── */
/*  Main ApplicationsPage Component                            */
/* ─────────────────────────────────────────────────────────── */
const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    jobId: '',
    applicantId: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedApp, setSelectedApp] = useState(null);           // for reject modal
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [cvModalVisible, setCvModalVisible] = useState(false);
  const [currentCv, setCurrentCv] = useState(null);

  // ── NEW: applicant detail modal state ──
  const [detailApp, setDetailApp] = useState(null);


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
      const apps = Array.isArray(responseData)
        ? responseData
        : (responseData.data || responseData.applications || []);

      // Backend returns: { success, applications, pagination: { totalApplications, totalPages, currentPage } }
      const total =
        responseData.pagination?.totalApplications ??
        responseData.total ??
        responseData.count ??
        apps.length;

      setApplications(apps);
      if (responseData.stats) {
        setStats(responseData.stats);
      }
      setPagination({
        ...pagination,
        total,
        current: params.pagination?.current || pagination.current,
        pageSize: params.pagination?.pageSize || pagination.pageSize,
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleTableChange = (pag, _filters, sorter) => {
    const newFilters = {};
    if (sorter.field) {
      newFilters.sortBy = sorter.field;
      newFilters.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    }
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchApplications({ pagination: pag, filters: newFilters });
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    if (name === 'search' && !value) delete newFilters.search;
    setFilters(newFilters);
    const newPag = { ...pagination, current: 1 };
    setPagination(newPag);
    fetchApplications({ pagination: newPag, filters: newFilters });
  };

  const handleSearch = (value) => {
    const newFilters = { ...filters, search: value, current: 1 };
    setFilters(newFilters);
    fetchApplications({ filters: newFilters, pagination: { ...pagination, current: 1 } });
  };

  const resetFilters = () => {
    const newFilters = { status: '', jobId: '', applicantId: '', search: '', sortBy: 'createdAt', sortOrder: 'desc' };
    setFilters(newFilters);
    fetchApplications({ filters: newFilters, pagination: { ...pagination, current: 1 } });
  };

  const handleStatusChange = (value) => handleFilterChange('status', value);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      if (status === 'rejected') {
        setSelectedApp(applicationId);
        setRejectModalVisible(true);
        return;
      }
      const endpoint = `${APPLICATION_API_END_POINT}/admin/applications/${applicationId}/approve`;
      const response = await axios.put(endpoint, {}, { withCredentials: true });
      if (!response.data.success) throw new Error('Failed to update status');
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
        ? `${APPLICATION_API_END_POINT}/admin/applications/${applicationId}/approve`
        : `${APPLICATION_API_END_POINT}/admin/applications/${applicationId}/reject`;
      const response = await axios.put(endpoint, status === 'rejected' ? { reason } : {}, { withCredentials: true });
      if (!response.data.success) throw new Error('Failed to update status');
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
      key: 'applicant',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.applicant?.fullname || 'N/A'}</div>
          <Text type="secondary">{record.applicant?.email || ''}</Text>
        </div>
      ),
    },
    {
      title: 'Job Title',
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
      key: 'location',
      render: (_, record) => formatLocation(record.job?.location),
    },
    {
      title: 'CV',
      key: 'cv',
      render: (_, record) => {
        const cvUrl = record.applicant?.profile?.resume || record.cv;
        return (
          <Button
            type="link"
            icon={<FileTextOutlined />}
            onClick={() => {
              setCurrentCv(cvUrl);
              setCvModalVisible(true);
            }}
            disabled={!cvUrl}
          >
            {cvUrl ? 'View CV' : 'No CV'}
          </Button>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusObj = {
          pending: { text: 'Pending', color: 'orange', icon: <ClockCircleOutlined /> },
          accepted: { text: 'Accepted', color: 'green', icon: <CheckCircleOutlined /> },
          rejected: { text: 'Rejected', color: 'red', icon: <CloseCircleOutlined /> },
        }[status] || { text: 'Unknown', color: 'default' };
        return (
          <Badge
            status={statusObj.color}
            text={<span>{statusObj.icon} {statusObj.text}</span>}
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
          {/* ── View button now opens modal, no navigation ── */}
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setDetailApp(record)}
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
      {/* Applicant Detail Modal */}
      {detailApp && (
        <ApplicantModal
          application={detailApp}
          onClose={() => setDetailApp(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Job Applications</Title>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#e0e7ff', borderRadius: '10px', color: '#4f46e5' }}>
              <FileTextOutlined style={{ fontSize: '24px' }} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Total Applications</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>{stats.totalApplications}</div>
            </div>
          </div>
        </Card>
        <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '10px', color: '#d97706' }}>
              <ClockCircleOutlined style={{ fontSize: '24px' }} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Pending</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#d97706' }}>{stats.pending}</div>
            </div>
          </div>
        </Card>
        <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#dcfce7', borderRadius: '10px', color: '#16a34a' }}>
              <CheckCircleOutlined style={{ fontSize: '24px' }} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Approved</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a' }}>{stats.accepted}</div>
            </div>
          </div>
        </Card>
        <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#fee2e2', borderRadius: '10px', color: '#dc2626' }}>
              <CloseCircleOutlined style={{ fontSize: '24px' }} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Rejected</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#dc2626' }}>{stats.rejected}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
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

      {/* Table */}
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

      {/* Reject reason modal */}
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
        onCancel={() => { setRejectModalVisible(false); setRejectReason(''); }}
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

      {/* CV preview modal */}
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
            <iframe
              src={currentCv}
              title="CV Preview"
              width="100%"
              height="600px"
              style={{ border: 'none', borderRadius: '8px' }}
            />
            <div className="mt-4 text-center">
              <Button
                type="primary"
                href={currentCv}
                target="_blank"
                rel="noopener noreferrer"
                icon={<FilePdfOutlined />}
              >
                Open / Download CV
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
