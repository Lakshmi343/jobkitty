

export const calculateUserRoles = (users) => {
  const roleCounts = users.reduce((acc, user) => {
    const role = user.role || 'Unknown';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(roleCounts).map(([role, count]) => ({
    role: role.charAt(0).toUpperCase() + role.slice(1),
    count
  }));
};

export const calculateJobStatus = (jobs, dashboardData) => {
  if (dashboardData.pendingJobs !== undefined) {
    return [
      { status: 'Active', count: dashboardData.approvedJobs || 0 },
      { status: 'Pending', count: dashboardData.pendingJobs || 0 },
      { status: 'Rejected', count: dashboardData.rejectedJobs || 0 }
    ];
  }
  const statusCounts = jobs.reduce((acc, job) => {
    const status = job.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count
  }));

};
export const calculateJobCategories = (jobs) => {
  const categoryCounts = jobs.reduce((acc, job) => {
    const category = job.category?.name || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};
export const calculateCompanyStatus = (companies) => {
  const statusCounts = companies.reduce((acc, company) => {
    const status = company.status || 'active';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count
  }));
};
export const calculateApplicationStatus = (applications, applicationStats) => {
  if (applicationStats.statusStats) {
    return applicationStats.statusStats.map(stat => ({
      status: stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
      count: stat.count
    }));
  }
  const statusCounts = applications.reduce((acc, app) => {
    const status = app.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count
  }));
};
export const calculateGrowth = (data) => {
  if (!data || data.length === 0) return 0;
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const thisWeek = data.filter(item => new Date(item.createdAt) >= lastWeek).length;
  const thisMonth = data.filter(item => new Date(item.createdAt) >= lastMonth).length;
  const lastMonthData = data.filter(item => {
    const createdAt = new Date(item.createdAt);
    return createdAt >= new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) && createdAt < lastMonth;
  }).length; 
  if (lastMonthData === 0) return thisMonth > 0 ? 100 : 0;
  return Math.round(((thisMonth - lastMonthData) / lastMonthData) * 100);
};
export const calculateCVFormats = (users) => {
  const formats = users.reduce((acc, user) => {
    if (user.profile?.resume) {
      const format = user.profile.resume.split('.').pop()?.toUpperCase() || 'PDF';
      acc[format] = (acc[format] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(formats).map(([format, count]) => ({
    format,
    count
  }));
};
export const calculateCVGrowth = (users) => {
  const usersWithCV = users.filter(user => user.profile?.resume);
  return calculateGrowth(usersWithCV);
};
export const getTopCategories = (jobs) => {
  const categories = calculateJobCategories(jobs);
  return categories.slice(0, 5);
};

export const formatGrowthTrend = (data, timeRange = 'month') => {
  if (!data || data.length === 0) return [];
  
  const now = new Date();
  const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const dailyCounts = {};
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateKey = date.toISOString().split('T')[0];
    dailyCounts[dateKey] = 0;
  }
  
  data.forEach(item => {
    if (item.createdAt && item.createdAt !== null && item.createdAt !== undefined) {
      const date = new Date(item.createdAt);
      if (!isNaN(date.getTime())) {
        const dateKey = date.toISOString().split('T')[0];
        if (dailyCounts.hasOwnProperty(dateKey)) {
          dailyCounts[dateKey]++;
        }
      }
    }
  }); 

  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count,
    label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));
};

export const calculateReportStatus = (reports) => {
  const statusCounts = reports.reduce((acc, report) => {
    const status = report.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count
  }));
};

export const calculateReportTypes = (reports) => {
  const typeCounts = reports.reduce((acc, report) => {
    const type = report.reportType || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(typeCounts).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count
  }));
};

export const calculateJobApprovalRate = (jobs, dashboardData) => {
  const totalJobs = jobs.length || dashboardData.totalJobs || 0;
  const approvedJobs = dashboardData.approvedJobs || jobs.filter(job => job.status === 'approved').length || 0;
  if (totalJobs === 0) return 0;
  return Math.round((approvedJobs / totalJobs) * 100);
};

export const calculateQualityScore = (jobs) => {
  const qualityCheckedJobs = jobs.filter(job => job.qualityCheck?.score); 
  if (qualityCheckedJobs.length === 0) return 'N/A'; 
  const totalScore = qualityCheckedJobs.reduce((sum, job) => sum + job.qualityCheck.score, 0);
  return Math.round(totalScore / qualityCheckedJobs.length * 10) / 10;
};
