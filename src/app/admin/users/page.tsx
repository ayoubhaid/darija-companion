'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, setUserAdminStatus } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/types';
import { Users, Search, Shield, ShieldCheck } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (!user) return;
    if (userId === user.uid) {
      alert("You cannot remove your own admin status!");
      return;
    }

    setUpdating(userId);
    try {
      await setUserAdminStatus(userId, !currentStatus, user.uid, user.displayName || 'Admin');
      setUsers(users.map(u => u.id === userId ? { ...u, isAdmin: !currentStatus } : u));
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage users and admin access</p>
      </div>

      <Card className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </Card>

      <Card>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">XP</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Admin</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userProfile) => (
                  <tr key={userProfile.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {(userProfile.displayName || userProfile.email || 'U')[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="ml-3 font-medium text-gray-900">
                          {userProfile.displayName || 'Anonymous'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{userProfile.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant="primary">Level {userProfile.level || 1}</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{userProfile.xp || 0} XP</td>
                    <td className="py-3 px-4 text-center">
                      {userProfile.isAdmin ? (
                        <ShieldCheck className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <Shield className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant={userProfile.isAdmin ? 'danger' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleAdmin(userProfile.id, userProfile.isAdmin || false)}
                        disabled={updating === userProfile.id || userProfile.id === user?.uid}
                      >
                        {userProfile.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
            {users.filter(u => u.isAdmin).length} Admins
          </span>
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {users.length} Total Users
          </span>
        </div>
      </div>
    </div>
  );
}
