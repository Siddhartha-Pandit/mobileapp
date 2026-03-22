import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  const { theme } = useTheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <View style={styles.titleContainer}>
        <Text
          style={[{
            fontFamily: Fonts.rounded,
            fontSize: 32,
            fontWeight: 'bold',
            color: theme.textPrimary,
          }]}>
          Explore
        </Text>
      </View>
      <Text style={{ color: theme.textPrimary }}>This app includes example code to help you get started.</Text>
      <Collapsible title="File-based routing">
        <Text style={{ color: theme.textSecondary }}>
          This app has two screens:{' '}
          <Text style={{ fontWeight: 'bold' }}>app/(tabs)/index.tsx</Text> and{' '}
          <Text style={{ fontWeight: 'bold' }}>app/(tabs)/explore.tsx</Text>
        </Text>
        <Text style={{ color: theme.textSecondary }}>
          The layout file in <Text style={{ fontWeight: 'bold' }}>app/(tabs)/_layout.tsx</Text>{' '}
          sets up the tab navigator.
        </Text>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <Text style={{ color: theme.brandPrimary }}>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <Text style={{ color: theme.textSecondary }}>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <Text style={{ fontWeight: 'bold' }}>w</Text> in the terminal running this project.
        </Text>
      </Collapsible>
      <Collapsible title="Images">
        <Text style={{ color: theme.textSecondary }}>
          For static images, you can use the <Text style={{ fontWeight: 'bold' }}>@2x</Text> and{' '}
          <Text style={{ fontWeight: 'bold' }}>@3x</Text> suffixes to provide files for
          different screen densities
        </Text>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <Text style={{ color: theme.brandPrimary }}>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <Text style={{ color: theme.textSecondary }}>
          This template has light and dark mode support. The{' '}
          <Text style={{ fontWeight: 'bold' }}>useColorScheme()</Text> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </Text>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <Text style={{ color: theme.brandPrimary }}>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <Text style={{ color: theme.textSecondary }}>
          This template includes an example of an animated component. The{' '}
          <Text style={{ fontWeight: 'bold' }}>components/HelloWave.tsx</Text> component uses
          the powerful{' '}
          <Text style={{ fontFamily: Fonts.mono, fontWeight: 'bold' }}>
            react-native-reanimated
          </Text>{' '}
          library to create a waving hand animation.
        </Text>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
