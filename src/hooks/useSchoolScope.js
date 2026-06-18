import { useAuth } from '../context/AuthContext';
import { DUMMY } from '../data/dummy';

export function useSchoolScope() {
  const { role, userId } = useAuth();
  const isSchoolAdmin = role === 'direct';

  if (!isSchoolAdmin) return { isSchoolAdmin: false, schoolId: null, schoolGroupIds: [] };

  const user = DUMMY.users.find(u => u.userId === userId);
  const groupIds = (user?.assignments || []).map(a => a.groupId);
  const firstGroup = groupIds.length > 0 ? DUMMY.groups.find(g => g.groupId === groupIds[0]) : null;
  const schoolId = firstGroup?.schoolId ?? null;
  const schoolGroupIds = schoolId
    ? DUMMY.groups.filter(g => g.schoolId === schoolId).map(g => g.groupId)
    : [];

  return { isSchoolAdmin, schoolId, schoolGroupIds };
}
