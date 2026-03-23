import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Tag, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { Card, CardContent } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { ColorPicker } from '../components/ColorPicker';
import HeaderBar from '../components/HeaderBar';
import { IconModal } from '../components/IconModal';

export default function CreateCustomCategoryScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0AA971');
  const [selectedIcon, setSelectedIcon] = useState<any>(Tag);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colors = [
    '#0AA971',
    '#3B82F6',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
    '#F97316',
  ];

  const handleSave = () => {
    if (!name.trim()) return;
    console.log('Saving Category:', { name, selectedColor, selectedIcon });
    router.back();
  };

  const IconComp = selectedIcon;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="New Category"
        leftContent={
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.headerButton, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}
          >
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* PREVIEW SECTION */}
          <Card 
            theme={theme} 
            style={[
              styles.previewCard, 
              { backgroundColor: `${selectedColor}08`, borderColor: `${selectedColor}40` }
            ]}
          >
            <CardContent theme={theme} style={styles.previewContent}>
              <View 
                style={[
                  styles.iconPreview, 
                  { backgroundColor: selectedColor, boxShadow: `0 8px 20px ${selectedColor}30`, elevation: 8 }
                ]}
              >
                <IconComp size={28} color="#fff" />
              </View>
              <View>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Visual Preview</Text>
                <Text style={[styles.previewTitle, { color: theme.textPrimary }]}>
                  {name || 'Category Name'}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* FORM FIELDS */}
          <View style={styles.form}>
            {/* Input Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Category Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Gaming, Coffee, Health"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { backgroundColor: theme.surface, borderColor: `${theme.border}60`, color: theme.textPrimary }]}
              />
            </View>

            {/* Icon Picker Trigger */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Category Icon</Text>
              <TouchableOpacity
                onPress={() => setIsModalOpen(true)}
                style={[styles.iconTrigger, { backgroundColor: theme.surface, borderColor: `${theme.border}60` }]}
              >
                <View style={styles.iconTriggerLeft}>
                  <View 
                    style={[
                      styles.iconBox, 
                      { backgroundColor: theme.background, borderColor: `${theme.border}60` }
                    ]}
                  >
                    <IconComp size={22} color={selectedColor} />
                  </View>
                  <Text style={[styles.iconTriggerText, { color: theme.textPrimary }]}>Change Icon</Text>
                </View>
                <ChevronRight size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Color Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Theme Color</Text>
              <Card theme={theme}>
                <CardContent theme={theme} style={{ padding: 16 }}>
                  <ColorPicker
                    theme={theme}
                    colors={colors}
                    selected={selectedColor}
                    onChange={setSelectedColor}
                  />
                </CardContent>
              </Card>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { borderTopColor: `${theme.border}40` }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.cancelButton, { borderColor: theme.border }]}
        >
          <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            title="Create Category"
            theme={theme}
            onPress={handleSave}
            disabled={!name.trim()}
            fullWidth
          />
        </View>
      </View>

      {/* ICON MODAL */}
      {isModalOpen && (
        <IconModal
          theme={theme}
          selectedIcon={selectedIcon}
          activeColor={selectedColor}
          onClose={() => setIsModalOpen(false)}
          onSelect={(icon) => {
            setSelectedIcon(icon);
            setIsModalOpen(false);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    padding: 24,
  },
  previewCard: {
    marginBottom: 32,
    borderStyle: 'dashed',
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  iconPreview: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    fontSize: 16,
  },
  iconTrigger: {
    height: 68,
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTriggerText: {
    fontWeight: '700',
    fontSize: 15,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 12,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
  },
  cancelButton: {
    paddingHorizontal: 24,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontWeight: '700',
  },
});
