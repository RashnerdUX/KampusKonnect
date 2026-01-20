import type { Route } from './+types/profile-edit';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Form, useNavigation } from 'react-router';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { data, useSubmit } from 'react-router';
import { Upload, ArrowLeft } from 'lucide-react';
import { requireAuth } from '~/utils/requireAuth.server';
import CustomFormTextInput from '~/components/auth/CustomFormInput';
import type { FormFieldProps } from '~/components/auth/CustomFormInput';
import { compressImageFile } from '~/hooks/useImageCompression';

export const meta = () => {
  return [
    { title: "Edit Profile | Campex" },
    { name: "description", content: "Update your Campex profile information." },
  ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { user } = await requireAuth(request);
  const { supabase, headers } = createSupabaseServerClient(request);

  // Fetch profile data & list of universities
  const [profileInfo, universities] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('universities')
      .select('id, name, slug')
      .order('name', { ascending: true }),
  ]);

  if (profileInfo.error || universities.error) {
    console.error('Error fetching profile:', profileInfo.error);
    throw new Response("Failed to load profile data", { status: 500 });
  }

  // Set profile & universities data
  let profile = profileInfo.data;
  let universitiesData = universities.data;

  const profileFields: FormFieldProps[] = [
    { type: 'text', label: "Username", name: "username", placeholder: "Enter your username", defaultValue: profile.username || '', required: true },
    { type: 'text', label: "First Name", name: "firstName", placeholder: "Enter your first name", defaultValue: profile.first_name || '', required: true },
    { type: 'text', label: "Surname", name: "surname", placeholder: "Enter your full name", defaultValue: profile.surname || '', required: true },
    { type: 'text', label: "Middle Name", name: "middleName", placeholder: "Enter your other names", defaultValue: profile.middle_name || '', required: false },
    { type: 'tel', label: "WhatsApp Number", name: "whatsappNumber", placeholder: "+234 (0) XXX-XXXX-XXXX", defaultValue: profile.whatsapp_number || '', required: true },
    { type: 'tel', label: "Phone Number", name: "phone", placeholder: "+234 (0) XXX-XXXX-XXXX", defaultValue: profile.phone_number || '', required: false },
    { type: 'textarea', label: "Bio", name: "bio", placeholder: "Tell us about yourself...", defaultValue: profile.bio || '', required: false },
    { type: 'select', label: "University", name: "university", defaultValue: profile.university_id || '', required: false, options: universitiesData.map(u => ({ label: u.name, value: u.id })) },
    { type: 'text', label: "Department", name: "department", placeholder: "Enter your department", defaultValue: profile.department || '', required: false },
  ]

  return data(
    {
      profile: profile,
      universities: universities.data,
      profileFields: profileFields,
    },
    { headers }
  );
}

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return { error: "Method not allowed", success: false };
  }

  const { user } = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const intent = formData.get('intent');

  if (intent === "delete-account") {
    // Handle account deletion
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id);
      if (error) {
        console.error('Error deleting account:', error);
        return { error: "Failed to delete account", success: false };
      }

      await supabase.auth.admin.deleteUser(user.id);

      return { message: "Account deleted successfully", success: true };
    } catch (err) {
      console.error('Error deleting account:', err);
      return { error: "Failed to delete account", success: false };
    }
  }

  // Handle profile update if it's not account deletion
  const surname = formData.get('surname') as string;
  const phone = formData.get('phone') as string;
  const firstName = formData.get('firstName') as string;
  const middleName = formData.get('middleName') as string;
  const username = formData.get('username') as string;
  const whatsappNumber = formData.get('whatsappNumber') as string;
  const bio = formData.get('bio') as string;
  const universityId = formData.get('university') as string;
  const department = formData.get('department') as string;


  let profileEdit = {
    surname,
    phone_number: phone,
    first_name: firstName,
    middle_name: middleName,
    username,
    whatsapp_number: whatsappNumber,
    bio,
    university_id: universityId,
    department,
  }
  console.log('Profile edit data:', profileEdit);

  // Upload to Supabase Storage
  const avatarFile = formData.get('avatar') as File | null;
  console.log('Avatar file from form data:', avatarFile);

  const filePath = `${user.id}/avatar.png`;
  let avatarUrl = null;

  if (avatarFile) {
    console.log('Uploading avatar file: ', avatarFile.name, avatarFile.size, avatarFile.type);
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);

    if (error) {
      console.error('Error uploading avatar:', error);
      return { error: "Failed to upload avatar", success: false };
    }

    console.log('Avatar uploaded successfully.');
    const { data } = await supabase.storage
      .from('avatars')
      .getPublicUrl(`avatars/${user.id}`);
    
    console.log('Avatar public URL:', data.publicUrl);

    avatarUrl = data.publicUrl;
  }

  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        ...profileEdit,
        avatar_url: avatarUrl,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return { error: "Failed to update profile", success: false };
    }

    return { message: "Profile updated successfully!", success: true };
  } catch (err) {
    console.error('Error updating profile:', err);
    return { error: "Failed to update profile", success: false };
  }
};

const ProfileEditPage = ({ loaderData, actionData }: Route.ComponentProps) => {
  const { profile, profileFields, universities } = loaderData;
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const blobUrlRef = useRef<string | null>(null)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Revoke previous blob URL if exists
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }
      
      try {
        setIsCompressing(true);
        const compressed = await compressImageFile(file,{ maxWidth: 800, maxHeight: 800, quality: 0.7});
        setCompressedFile(compressed);

        // Create new blob URL for preview
        const blobUrl = URL.createObjectURL(compressed);
        blobUrlRef.current = blobUrl;
        setAvatarPreview(blobUrl);

        // Debugging logs
        console.log('Original file size:', file.size / 1024, 'KB');
        console.log('Compressed file size:', compressed.size / 1024, 'KB');

      } catch (error) {
        console.error('Error compressing image:', error);

        // Fallback to original file if compression fails
        const blobUrl = URL.createObjectURL(file);
        blobUrlRef.current = blobUrl;
        setAvatarPreview(blobUrl);
        setCompressedFile(file);

      } finally {
        setIsCompressing(false);
      }
    }
  };

  useEffect(() => {
      return () => {
        // Remove the URL when unmounting
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current)
          blobUrlRef.current = null
        }
      }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isCompressing) {
      e.preventDefault();
      alert('Please wait until the image is done compressing.');
    }

    // Append compressed file to form data
    if (compressedFile) {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      formData.set('avatar', compressedFile);

      // Manually submit the form with the updated FormData
      submit(formData, { method: 'post', encType: 'multipart/form-data' });
    };
  };

  if (navigation.state === 'submitting' && !isUpdatingProfile) {
    setIsUpdatingProfile(true);
  } else if (navigation.state === 'idle' && isUpdatingProfile) {
    setIsUpdatingProfile(false);
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-2xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <button
            onClick={() => navigate('/marketplace/profile')}
            className='p-2 hover:bg-muted rounded-lg transition-colors'
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className='text-3xl font-bold'>Edit Profile</h1>
        </div>

        {/* Success Message */}
        {actionData?.success && (
          <div className='bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6'>
            <p className='font-medium'>{actionData.message}</p>
          </div>
        )}

        {/* Error Message */}
        {actionData?.error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6'>
            <p className='font-medium'>{actionData.error}</p>
          </div>
        )}

        {/* Form */}
        <Form method='POST' className='bg-white dark:bg-slate-800 rounded-lg shadow-md p-8' onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Profile Picture</h2>
            <div className='flex items-start gap-6'>
              {/* Avatar Preview */}
              <div className='w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0'>
                {avatarPreview ? (
                  <img src={avatarPreview} alt='Avatar preview' className='w-full h-full object-cover' />
                ) : (
                  <span className='text-5xl font-bold text-primary'>
                    {profile.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>

              {/* Upload Button */}
              <div className='flex-1'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <div className='bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2'>
                    <Upload size={18} />
                    Upload Photo
                  </div>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    className='hidden'
                  />
                </label>
                <p className='text-sm text-muted-foreground mt-2'>
                  JPG, PNG or GIF (Max 5MB)
                </p>
              </div>
            </div>
          </div>

          <hr className='my-8' />

          {/* Personal Information */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-6'>Personal Information</h2>
            <div className='space-y-6'>
              {/* Email (Read Only) */}
              <div>
                <label className='block text-sm font-medium mb-2'>Email Address</label>
                <input
                  type='email'
                  value={profile.email || ''}
                  className='w-full px-4 py-3 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed'
                  disabled
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  Email cannot be changed. Contact support if you need assistance.
                </p>
              </div>

              {/* Dynamic Profile Fields */}
              {profileFields.map((field) => (
                <div key={field.name}>
                  <CustomFormTextInput {...field} />
                </div>
              ))}

            </div>
          </div>

          <hr className='my-8' />

          {/* Account Settings */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-6'>Account Settings</h2>
            <div className='space-y-4'>
              <button
                type='button'
                className='w-full px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors text-left font-medium'
                onClick={()=> {
                  navigate('/auth/reset-password');
                }}
              >
                Change Password
              </button>
              <button
                type='button'
                className='w-full px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors text-left font-medium'
                hidden
              >
                Two-Factor Authentication
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex gap-4'>
            <button
              type='submit'
              name='intent'
              value='update-profile'
              disabled={isUpdatingProfile || isCompressing}
              className='flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium'
            >
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type='button'
              onClick={() => navigate('/marketplace/profile')}
              className='flex-1 border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors font-medium'
            >
              Cancel
            </button>
          </div>
        </Form>

        {/* Danger Zone */}
        <div className='mt-12 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-lg p-8'>
          <h2 className='text-xl font-semibold text-red-700 dark:text-red-300 mb-4'>Danger Zone</h2>
          <p className='text-sm text-red-600 dark:text-red-400 mb-4'>
            Deleting your account is permanent and cannot be undone. All your data will be removed.
          </p>
          <Form method='POST'>
            <button
              type='submit'
              name='intent' 
              value="delete-account"
              disabled
              className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
            >
              Delete Account
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
