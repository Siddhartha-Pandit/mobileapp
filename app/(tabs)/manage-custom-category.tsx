import { useRouter } from 'expo-router';
import { ChevronRight, Tag } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent } from '@/components/Card';
import { ColorPicker } from '@/components/ColorPicker';
import HeaderBar from '@/components/HeaderBar';
import { IconModal } from '@/components/IconModal';
import { PrimaryButton } from '@/components/PrimaryButton';
import { FormInput } from '@/components/FormInput';
import { useTheme } from '@/hooks/useTheme';

export default function CreateManageCustomCategoryScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0AA971');
  const [selectedIcon, setSelectedIcon] = useState<any>(Tag);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colors = [
    '#0AA971', '#3B82F6', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  ];

  const handleSave = () => {
    if (!name.trim()) return;
    console.log('Saving Category:', { name, selectedColor, selectedIcon });
    router.back();
  };

  const IconComp = selectedIcon;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="New Category"
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.previewSection}>
          <Card
            theme={theme}
            style={[
              styles.previewCard,
              { backgroundColor: `${selectedColor}08`, borderColor: `${selectedColor}40` }
            ]}
          >
            <CardContent theme={theme} style={styles.previewContent}>
              <View style={[styles.iconPreview, { backgroundColor: selectedColor }]}>
                <IconComp size={32} color="#fff" />
              </View>
              <View style={styles.previewTextContainer}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Visal Preview</Text>
                <Text style={[styles.previewTitle, { color: theme.textPrimary }]}>
                  {name || 'Category Name'}
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        <View style={styles.formContainer}>
          <FormInput
            label="Category Name"
            value={name}
            onChangeText={setName}
            theme={theme}
            placeholder="e.g. Gaming, Coffee, Health"
            icon={<Tag />}
          />

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary, marginBottom: 12 }]}>Category Icon</Text>
            <TouchableOpacity
              onPress={() => setIsModalOpen(true)}
              activeOpacity={0.7}
              style={[styles.iconTrigger, { backgroundColor: theme.surface, borderColor: `${theme.border}40` }]}
            >
              <View style={styles.iconTriggerLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.background, borderColor: `${theme.border}40` }]}>
                  <IconComp size={24} color={selectedColor} />
                </View>
                <Text style={[styles.iconTriggerText, { color: theme.textPrimary }]}>Choose an Icon</Text>
              </View>
              <ChevronRight size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary, marginBottom: 12 }]}>Theme Color</Text>
            <Card theme={theme} style={styles.colorCard}>
              <CardContent theme={theme} style={styles.colorContent}>
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
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          title="Create Category"
          theme={theme}
          onPress={handleSave}
          disabled={!name.trim()}
        />
      </View>

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
  safeArea: { flex: 1 },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 200,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  previewSection: { marginBottom: 40 },
  previewCard: { borderRadius: 32, borderStyle: 'dashed', borderWidth: 1.5 },
  previewContent: { flexDirection: 'row', alignItems: 'center', gap: 20, padding: 24 },
  iconPreview: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' },
  previewTextContainer: { flex: 1 },
  previewTitle: { fontSize: 24, fontWeight: '900', marginTop: 2 },
  label: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
  formContainer: { gap: 32 },
  inputGroup: { width: '100%' },
  iconTrigger: { 
    height: 72, 
    borderRadius: 22, 
    borderWidth: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  iconTriggerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  iconTriggerText: { fontWeight: '800', fontSize: 16 },
  colorCard: { borderRadius: 26 },
  colorContent: { padding: 20 },
  footer: { 
    position: "absolute", 
    bottom: 72, 
    left: 0, 
    right: 0, 
    padding: 24, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    zIndex: 100,
  },
});
