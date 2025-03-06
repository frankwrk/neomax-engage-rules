import { getUserProfile, getSession } from '@/lib/auth-utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

/**
 * Server component that wraps admin pages with authentication and admin information
 */
export async function AdminPageWrapper({ children }: { children: React.ReactNode }) {
  // Get user session and profile
  const session = await getSession();
  const profile = await getUserProfile(session);
  const adminName = profile?.full_name || 'Admin';
  
  return (
    <div>
      <div className="mb-6">
        <Alert className="bg-gradient-to-r from-orange-950 to-gray-900 border-orange-600">
          <div className="flex justify-between items-center">
            <div>
              <AlertTitle className="text-orange-500">Admin Control Panel</AlertTitle>
              <AlertDescription>
                Logged in as {adminName}
              </AlertDescription>
            </div>
            <Badge variant="outline" className="border-orange-500 text-orange-500">
              Admin Role
            </Badge>
          </div>
        </Alert>
      </div>
      
      {children}
    </div>
  );
}
