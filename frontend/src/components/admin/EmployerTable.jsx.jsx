import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MoreHorizontal, UserCheck, UserX, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const EmployerTable = ({ employers = [], updateUserStatus, deleteUser }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium">Name</th>
            <th className="text-left p-3 font-medium">Email</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employers.length > 0 ? (
            employers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{user.fullname}</td>
                <td className="p-3 text-sm text-gray-600">{user.email}</td>
                <td className="p-3">
                  <Badge className={getStatusColor(user.status)}>{user.status || 'active'}</Badge>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateUserStatus(user._id, 'active')}>
                          <UserCheck className="mr-2 h-4 w-4" /> Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateUserStatus(user._id, 'inactive')}>
                          <UserX className="mr-2 h-4 w-4" /> Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteUser(user._id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                No employers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployerTable;
