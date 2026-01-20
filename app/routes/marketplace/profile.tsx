import type { Route } from './+types/profile';
import { useState } from 'react';
import { Link, useNavigate, Form, useSubmit, redirect } from 'react-router';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { getOptionalAuth } from '~/utils/optionalAuth.server';
import { data } from 'react-router';
import { LogOut, Settings, HelpCircle, Bell, Heart, ShoppingBag, Star, Gift, CreditCard } from 'lucide-react';
import { FaRegEdit } from "react-icons/fa";
import type { profileMenuItem, profileMenuItemId } from '~/components/marketplace/ProfileMenuItem';
import ProfileMenuItem from '~/components/marketplace/ProfileMenuItem';
import { isMobileUserAgent } from '~/utils/guardMobileRoutes';

export const meta = () => {
  return [
    { title: "My Profile | Campex" },
    { name: "description", content: "Manage your Campex profile, orders, wishlist, and account settings." },
  ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { user, supabase, headers } = await getOptionalAuth(request);

  // Check if user is on mobile
  const isMobile = isMobileUserAgent(request);

  // A Guest account for anonymous users
  const guestProfile = {
          id: 1,
          username: 'Guest User',
          surname: '',
          first_name: 'Guest',
          email: 'guest@example.com',
          avatar_url: 'https://slijaoqgxaewlqthtahj.supabase.co/storage/v1/object/public/assets/Snow%20Avatar.jpg',
      };

  // Fetch user profile data
  if (!user) {
    return data(
      {
        profile: guestProfile,
        isUserOnMobile: isMobile
      },
      { headers }
    );
  }

  // Get Profile data if User is logged in
  const { data: profileData, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
  }

  // Get the profile avatar URL
  const avatarFilePath = profileData?.avatar_url;
  if (avatarFilePath) {
    const { data: avatarData, error: avatarError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(avatarFilePath, 3600); // URL valid for 1 hour

    if (avatarError) {
      console.error('Error fetching avatar URL:', avatarError);
    }

    profileData.avatar_url = avatarData?.signedUrl || null;
  }

  return data(
    {
      profile: profileData || guestProfile,
      isUserOnMobile: isMobile,
    },
    { headers }
  );
}

export const action = async ({request}: Route.ActionArgs) => {
  const {supabase, headers} = createSupabaseServerClient(request);
  const currentLocation = new URL(request.url);
  const formData = await request.formData();

  // Get the action type
  const actionType = formData.get("action") as string;

  if (actionType === "logout"){
    console.log("Signing the user out of application")

    // Log the user out
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out: ", error.message);
        return redirect(currentLocation.pathname, {headers: headers});
      }

      return redirect("/login", {headers: headers});
  }
}

const UserProfile = ({ loaderData }: Route.ComponentProps) => {
  const { profile, isUserOnMobile } = loaderData;
  const navigate = useNavigate();
  const submit = useSubmit();
  const [activeSection, setActiveSection] = useState<profileMenuItemId['id']>('orders');

  const primaryMenuItems: profileMenuItem[] = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: 3, menutype: "primary" },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: 12, menutype: "primary" },
    { id: 'reviews', label: 'Reviews', icon: Star, count: 2, menutype: "primary"},
    { id: 'vouchers', label: 'Vouchers', icon: Gift, count: 5, menutype: "primary" },
    { id: 'wallet', label: 'Wallet', icon: CreditCard, count: null, menutype: "primary"},
  ] as const;

  const secondaryMenuItems: profileMenuItem[] = [
    { id: 'notifications', label: 'Notifications', icon: Bell, menutype: "secondary" },
    { id: 'support', label: 'Help & Support', icon: HelpCircle, menutype: "secondary"},
    { id: 'settings', label: 'Settings', icon: Settings, menutype: "secondary"},
    { id: 'logout', label: 'Log Out', icon: LogOut, isDestructive: true, menutype: "secondary", buttonType: "submit" },
  ] as const;

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');

    // Create a new form and submit it to the logout route
    const formData = new FormData();
    formData.append('action', 'logout');
    submit(formData, { method: 'post' });
  };

  const handleMenuClickonMobile = (id: profileMenuItemId["id"]) => {
    if (isUserOnMobile){
      // Navigate to a dedicated user page
      navigate(`/marketplace/${id}`);
    } else setActiveSection (id);
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Profile Header Card */}
        <div className='bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-2 lg:gap-6'>
              {/* Avatar */}
              <div className='size-11 lg:size-24 bg-primary/20 rounded-full flex items-center justify-center overflow-hidden'>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.username ?? 'User Avatar'} className='w-full h-full object-cover' />
                ) : (
                  <span className='text-3xl font-bold text-primary'>
                    {profile.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>

              {/* Profile Info */}
              <div className='flex flex-col gap-0.5 lg:gap-2'>
                <h1 className='text-lg lg:text-3xl font-bold text-foreground'>Hi, {profile.username}</h1>
                <p className='text-xs hidden lg:block lg:text-sm text-foreground/80'>{profile.email}</p>
                <p className='text-xs lg:text-sm text-foreground/80 underline'>Edit your profile here</p>
              </div>
            </div>

            {/* Edit Button */}
            <Link
              to='/marketplace/profile-edit'
              className='flex items-center justify-center gap-2 bg-primary text-primary-foreground p-2 lg:px-4 lg:py-2 rounded-lg hover:bg-primary/90 transition-colors'
            >
              <FaRegEdit className='size-3' />
              <span className='hidden lg:block'>Edit Profile</span>
            </Link>

          </div>
        </div>

        {/* Main Content Area */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Primary Menu Sidebar */}
          <div className='lg:col-span-1'>
            <nav className='bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden'>
              <ul className='divide-y divide-border'>
                {primaryMenuItems.map((item) => (
                  <ProfileMenuItem
                    key={item.id}
                    item={{ ...item, menutype: 'primary' }}
                    isActive={activeSection === item.id}
                    onClick={() => handleMenuClickonMobile(item.id)}
                  />
                ))}
              </ul>
            </nav>

            {/* Secondary Menu */}
            <nav className='mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden'>
              <ul className='divide-y divide-border'>
                {secondaryMenuItems.map((item) => (
                  <ProfileMenuItem
                    key={item.id}
                    item={{ ...item, menutype: 'secondary' }}
                    onClick={() =>
                      item.id === 'logout'
                        ? handleLogout()
                        : handleMenuClickonMobile(item.id)
                    }
                  />
                ))}
              </ul>
            </nav>
          </div>

          {/* Content Area. For PC Only */}
          <div className='lg:col-span-3 hidden lg:block'>
            <div className='bg-white dark:bg-slate-800 rounded-lg shadow-md p-8'>
              {activeSection === 'orders' && (
                <div>
                  <h2 className='text-2xl font-bold mb-6'>My Orders</h2>
                  <div className='space-y-4'>
                    {[1, 2, 3].map((order) => (
                      <div key={order} className='border border-border rounded-lg p-4 hover:shadow-md transition-shadow'>
                        <div className='flex items-start justify-between'>
                          <div>
                            <p className='font-semibold text-foreground'>Order #10000{order}</p>
                            <p className='text-sm text-muted-foreground'>Placed on Jan {order}, 2026</p>
                          </div>
                          <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium dark:bg-blue-950 dark:text-blue-300'>
                            In Transit
                          </span>
                        </div>
                        <div className='mt-3 flex items-center justify-between'>
                          <p className='text-foreground'>₦5,500</p>
                          <button className='text-primary hover:underline text-sm'>View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'wishlist' && (
                <div>
                  <h2 className='text-2xl font-bold mb-6'>My Wishlist</h2>
                  <p className='text-muted-foreground'>
                    View your wishlist by navigating to the <Link to='/marketplace/wishlist' className='text-primary hover:underline'>Wishlist page</Link>
                  </p>
                </div>
              )}

              {activeSection === 'reviews' && (
                <div>
                  <h2 className='text-2xl font-bold mb-6'>My Reviews</h2>
                  <div className='space-y-4'>
                    {[1, 2].map((review) => (
                      <div key={review} className='border border-border rounded-lg p-4'>
                        <div className='flex items-start justify-between mb-2'>
                          <p className='font-semibold'>Great product quality!</p>
                          <span className='text-yellow-500'>★★★★★</span>
                        </div>
                        <p className='text-sm text-muted-foreground mb-2'>Reviewed on Jan {review}, 2026</p>
                        <p className='text-foreground'>Product arrived on time and exceeded expectations.</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'vouchers' && (
                <div>
                  <h2 className='text-2xl font-bold mb-6'>My Vouchers</h2>
                  <div className='space-y-4'>
                    {[1, 2, 3, 4, 5].map((voucher) => (
                      <div key={voucher} className='border-2 border-primary rounded-lg p-4 bg-primary/5'>
                        <div className='flex items-start justify-between'>
                          <div>
                            <p className='font-semibold text-foreground'>Save ₦{500 * voucher}</p>
                            <p className='text-sm text-muted-foreground'>Expires Dec {25 + voucher}, 2026</p>
                          </div>
                          <button className='bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm'>
                            Use Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'wallet' && (
                <div>
                  <h2 className='text-2xl font-bold mb-6'>Wallet & Payment Methods</h2>
                  
                  {/* Wallet Balance */}
                  <div className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-6 mb-8'>
                    <p className='text-sm opacity-90 mb-2'>Wallet Balance</p>
                    <h3 className='text-4xl font-bold'>₦12,500</h3>
                  </div>

                  {/* Payment Methods */}
                  <h3 className='text-lg font-semibold mb-4'>Saved Payment Methods</h3>
                  <div className='space-y-3'>
                    {[1, 2].map((method) => (
                      <div key={method} className='border border-border rounded-lg p-4 flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold'>
                            CARD
                          </div>
                          <div>
                            <p className='font-semibold'>Card {method}</p>
                            <p className='text-sm text-muted-foreground'>****  ****  ****  {3456 + method}</p>
                          </div>
                        </div>
                        <button className='text-red-600 hover:bg-red-50 dark:hover:bg-red-950 px-3 py-2 rounded transition-colors text-sm'>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <button className='mt-6 border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors font-medium'>
                    Add Payment Method
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;