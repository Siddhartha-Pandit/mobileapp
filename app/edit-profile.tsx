import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, User, Lock, Eye, EyeOff, Save, KeyRound, Loader2, Briefcase, Phone } from 'lucide-react-native';
import { useAuthStore, API_URL } from '../src/store/useAuthStore';
import * as ImagePicker from 'expo-image-picker';
import HeaderBar from '../components/HeaderBar';
import UserAvatar from '../components/UserAvatar';

const EditProfileScreen = () => {
  const { theme } = useTheme();
  const isDark = theme.background === '#121212';
  const router = useRouter();
  const { user, updateProfile, refreshUser } = useAuthStore();

  // Profile State
  const [fullName, setFullName] = React.useState(user?.fullName || '');
  const [occupation, setOccupation] = React.useState(user?.occupation || '');
  const [gender, setGender] = React.useState(user?.gender || '');
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [avatarUri, setAvatarUri] = React.useState(user?.avatarUrl || '');

  React.useEffect(() => {
    refreshUser().catch(console.error);
  }, []);

  // Update local state if store user changes (e.g. after refresh)
  React.useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setOccupation(user.occupation || '');
      setGender(user.gender || '');
      setPhone(user.phone || '');
      setAvatarUri(user.avatarUrl || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) return;
    setIsUpdatingProfile(true);
    try {
      await updateProfile({ fullName, occupation, gender, phone });
      await refreshUser(); // Fetch latest from server
      Alert.alert('Success', 'Profile updated successfully');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const uploadImageToCloud = async (uri: string) => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('file', blob, 'profile.jpg');
      } else {
        // @ts-ignore
        formData.append('file', {
          uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await fetch(`${API_URL}/auth/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${useAuthStore.getState().accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();

      // Update profile with new avatar URL
      await updateProfile({ avatarUrl: data.url });
      setAvatarUri(data.url);
      Alert.alert('Success', 'Profile picture updated');
    } catch (e: any) {
      Alert.alert('Upload Error', e.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImageToCloud(uri);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Edit Profile"
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={[styles.avatarWrapper, { borderColor: theme.brandPrimary + '30' }]}
              onPress={handlePickImage}
              disabled={isUploadingImage}
            >
              {isUploadingImage ? (
                <View style={styles.avatarPlaceholder}>
                  <Loader2 size={32} color={theme.brandPrimary} />
                </View>
              ) : (
                <UserAvatar
                  fullName={fullName}
                  email={user?.email}
                  avatarUrl={avatarUri}
                  size={104}
                  theme={theme}
                />
              )}
              <View style={[styles.cameraBtn, { backgroundColor: theme.brandPrimary }]}>
                <Camera size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.emailText, { color: theme.textSecondary }]}>{user?.email}</Text>
          </View>

          {/* Basic Info Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Basic Information</Text>
            <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <User size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Briefcase size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                value={occupation}
                onChangeText={setOccupation}
                placeholder="Occupation"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Phone size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone Number"
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  style={[
                    styles.genderBtn,
                    {
                      backgroundColor: gender === g ? theme.brandPrimary : theme.surface,
                      borderColor: gender === g ? theme.brandPrimary : theme.border
                    }
                  ]}
                >
                  <Text style={[
                    styles.genderText,
                    { color: gender === g ? '#FFF' : theme.textSecondary }
                  ]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <PrimaryButton
              title="Save Profile"
              theme={theme}
              onPress={handleUpdateProfile}
              isLoading={isUpdatingProfile}
              style={styles.saveBtn}
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  backBtn: { padding: 4 },
  scrollContent: { padding: 20 },
  avatarContainer: { alignItems: 'center', marginVertical: 30 },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    position: 'relative',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: '100%', height: '100%', borderRadius: 60 },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  emailText: { marginTop: 12, fontSize: 14, fontWeight: '600' },
  section: { marginTop: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  sectionSubtitle: { fontSize: 13, marginBottom: 20, lineHeight: 18 },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, fontWeight: '600' },
  saveBtn: { marginTop: 8 },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  genderBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '700',
  },
  passwordSection: {
    marginTop: 40,
    paddingTop: 30,
    borderTopWidth: 1,
  },
  passwordForm: { marginTop: 10 },
});

export default EditProfileScreen;
