import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from './supabase';

const C = {
  bg: '#080B12',
  panel: '#111723',
  panel2: '#171F2D',
  border: '#263142',
  gold: '#D8B978',
  goldLight: '#F3DDAA',
  silver: '#E8EDF4',
  silver2: '#AAB5C4',
  white: '#FFFFFF',
  muted: '#7F8B9D',
  green: '#69D6A5',
  red: '#FF8585',
};

function Brand({ small = false }) {
  return (
    <View>
      <Text style={[styles.brand, small && { fontSize: 22 }]}>
        REELVYA
      </Text>
      <Text style={styles.brandTag}>CREATE • OPTIMIZE • GROW</Text>
    </View>
  );
}

function GoldButton({ title, onPress, loading, disabled, icon }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.goldButton, (disabled || loading) && { opacity: 0.55 }]}
    >
      {loading ? (
        <ActivityIndicator color={C.bg} />
      ) : (
        <View style={styles.buttonInner}>
          {icon ? <Ionicons name={icon} size={18} color={C.bg} /> : null}
          <Text style={styles.goldButtonText}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function OutlineButton({ title, onPress, icon }) {
  return (
    <TouchableOpacity style={styles.outlineButton} onPress={onPress}>
      {icon ? <Ionicons name={icon} size={17} color={C.gold} /> : null}
      <Text style={styles.outlineButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function Field({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'none'}
        autoCorrect={false}
      />
    </View>
  );
}

function Notice({ message, type = 'info' }) {
  if (!message) return null;
  const color = type === 'error' ? C.red : type === 'success' ? C.green : C.gold;
  return (
    <View style={[styles.notice, { borderColor: color + '66' }]}>
      <Ionicons
        name={type === 'error' ? 'alert-circle-outline' : type === 'success' ? 'checkmark-circle-outline' : 'information-circle-outline'}
        size={18}
        color={color}
      />
      <Text style={[styles.noticeText, { color }]}>{message}</Text>
    </View>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('info');

  const showNotice = (message, type = 'info') => {
    setNotice(message);
    setNoticeType(type);
  };

  const handleAuth = async () => {
    setNotice('');

    if (!email.trim() || !password) {
      showNotice('Email aur password dono bhariye.', 'error');
      return;
    }

    if (password.length < 6) {
      showNotice('Password kam se kam 6 characters ka hona chahiye.', 'error');
      return;
    }

    setLoading(true);

    try {
      let result;

      if (mode === 'signup') {
        result = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
      }

      if (result.error) {
        throw result.error;
      }

      if (mode === 'signup' && !result.data.session) {
        showNotice(
          'Account request successful. Apna email inbox check karke verification complete karein.',
          'success'
        );
      } else {
        showNotice('Login successful.', 'success');
      }
    } catch (error) {
      showNotice(
        error?.message || 'Connection error. Internet aur Supabase settings check karein.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
          <View style={styles.authTop}>
            <View style={styles.logoMark}>
              <Ionicons name="aperture-outline" size={30} color={C.goldLight} />
            </View>
            <Brand />
            <Text style={styles.authEyebrow}>THE CREATOR WORKSPACE</Text>
          </View>

          <View style={styles.authCard}>
            <Text style={styles.eyebrow}>WELCOME TO REELVYA</Text>
            <Text style={styles.authTitle}>
              {mode === 'login' ? 'Welcome back.' : 'Create your account.'}
            </Text>
            <Text style={styles.subText}>
              {mode === 'login'
                ? 'Your content journey continues here.'
                : 'One workspace. A smarter creator workflow.'}
            </Text>

            <View style={styles.modeSwitch}>
              <TouchableOpacity
                onPress={() => { setMode('login'); setNotice(''); }}
                style={[styles.modeTab, mode === 'login' && styles.modeTabActive]}
              >
                <Text style={[styles.modeText, mode === 'login' && styles.modeTextActive]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setMode('signup'); setNotice(''); }}
                style={[styles.modeTab, mode === 'signup' && styles.modeTabActive]}
              >
                <Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>Create account</Text>
              </TouchableOpacity>
            </View>

            <Field
              label="EMAIL ADDRESS"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
            />
            <Field
              label="PASSWORD"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />

            <Notice message={notice} type={noticeType} />

            <GoldButton
              title={mode === 'login' ? 'LOGIN TO REELVYA' : 'CREATE ACCOUNT'}
              onPress={handleAuth}
              loading={loading}
              icon="arrow-forward"
            />

            <Text style={styles.authFoot}>
              By continuing, you agree to use Reelvya responsibly.
            </Text>
          </View>

          <Text style={styles.footerText}>A PREMIUM SPACE FOR EVERY CREATOR</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionTitle({ title, subtitle, right }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {right || null}
    </View>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={20} color={C.gold} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function HomeScreen({ onCreate, projects, userEmail }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.screenContent}>
      <View style={styles.topBar}>
        <Brand small />
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={19} color={C.goldLight} />
        </View>
      </View>

      <View style={styles.welcomeBlock}>
        <Text style={styles.eyebrow}>YOUR CREATOR SPACE</Text>
        <Text style={styles.heroTitle}>Create with{'\n'}more clarity.</Text>
        <Text style={styles.heroSubtitle}>
          Your content workflow, organized in one premium workspace.
        </Text>
        <GoldButton title="START CREATING" onPress={onCreate} icon="sparkles-outline" />
      </View>

      <SectionTitle title="Your overview" subtitle="A quick look at your workspace" />
      <View style={styles.statsRow}>
        <StatCard icon="videocam-outline" value={String(projects.length)} label="Projects" />
        <StatCard icon="sparkles-outline" value="—" label="AI credits" />
        <StatCard icon="trending-up-outline" value="—" label="Reach" />
      </View>

      <View style={styles.featureCard}>
        <View style={styles.featureIcon}>
          <Ionicons name="layers-outline" size={23} color={C.goldLight} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>One video. Multiple platforms.</Text>
          <Text style={styles.cardDescription}>
            Prepare platform-specific content for YouTube, Instagram and Facebook.
          </Text>
        </View>
      </View>

      <SectionTitle title="Recent projects" subtitle="Your latest work" />
      {projects.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="folder-open-outline" size={27} color={C.muted} />
          <Text style={styles.emptyTitle}>Your workspace is ready</Text>
          <Text style={styles.cardDescription}>Your created projects will appear here.</Text>
          <OutlineButton title="Create your first project" onPress={onCreate} icon="add" />
        </View>
      ) : (
        projects.slice(0, 3).map((item) => (
          <View style={styles.projectRow} key={item.id}>
            <View style={styles.projectIcon}>
              <Ionicons name="videocam-outline" size={20} color={C.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription}>{item.date}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.muted} />
          </View>
        ))
      )}

      <Text style={styles.accountLine}>Signed in as {userEmail || 'Creator'}</Text>
    </ScrollView>
  );
}

function CreateScreen({ onSaved, onBack }) {
  const [video, setVideo] = useState(null);
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [result, setResult] = useState(null);

  const chooseVideo = async () => {
    setNotice('');
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (picked.canceled) return;

      const file = picked.assets && picked.assets[0];
      if (!file) {
        setNotice('Video select nahi ho paya. Dobara try karein.');
        return;
      }

      setVideo(file);
      setResult(null);
    } catch (error) {
      setNotice(error?.message || 'Video select karte waqt error aaya.');
    }
  };

  const generatePreview = () => {
    if (!video) {
      setNotice('Pehle apna video upload karein.');
      return;
    }

    setLoading(true);
    setNotice('');
    setResult(null);

    setTimeout(() => {
      const topic = hint.trim() || video.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') || 'Your video';

      setResult({
        topic,
        youtubeTitle: `${topic} | A Story Worth Watching`,
        youtubeDescription: `Discover the key moments in ${topic}. This is a sample description preview. Connect the Reelvya AI backend to generate content from your actual video.`,
        instagramCaption: `Every frame has a story. ✨\n\n${topic}\n\n#Reelvya #Creator #ContentCreation`,
        facebookCaption: `Sharing a new video: ${topic}. Watch and share your thoughts.`,
        tags: ['creator', 'video', 'content', 'Reelvya'],
      });
      setLoading(false);
    }, 600);
  };

  const saveProject = () => {
    if (!result) return;
    onSaved({
      id: String(Date.now()),
      name: result.topic,
      date: new Date().toLocaleDateString(),
    });
    setNotice('Sample project saved in this session.');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.screenContent}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={21} color={C.silver} />
        </TouchableOpacity>
        <Brand small />
        <View style={{ width: 38 }} />
      </View>

      <Text style={styles.eyebrow}>CONTENT STUDIO</Text>
      <Text style={styles.pageTitle}>Create something{'\n'}remarkable.</Text>
      <Text style={styles.pageSubtitle}>
        Upload once. Prepare content for every platform.
      </Text>

      <SectionTitle title="01 — Upload your video" subtitle="Choose a video from your device" />
      <TouchableOpacity style={styles.uploadBox} onPress={chooseVideo} activeOpacity={0.8}>
        <View style={styles.uploadIcon}>
          <Ionicons name="cloud-upload-outline" size={27} color={C.goldLight} />
        </View>
        <Text style={styles.uploadTitle}>{video ? video.name : 'Choose a video'}</Text>
        <Text style={styles.uploadSub}>
          {video ? 'Video selected successfully' : 'MP4, MOV and other supported video formats'}
        </Text>
        <Text style={styles.uploadAction}>{video ? 'CHANGE VIDEO' : 'BROWSE FILES'}</Text>
      </TouchableOpacity>

      <SectionTitle title="02 — Add a creative hint" subtitle="Optional. Leave blank if you prefer." />
      <TextInput
        style={[styles.input, styles.hintInput]}
        value={hint}
        onChangeText={setHint}
        placeholder="Example: A travel vlog about Manali..."
        placeholderTextColor={C.muted}
        multiline
      />

      <View style={styles.platformRow}>
        <View style={styles.platformChip}>
          <Ionicons name="logo-youtube" size={17} color="#FF7777" />
          <Text style={styles.platformText}>YouTube</Text>
        </View>
        <View style={styles.platformChip}>
          <Ionicons name="logo-instagram" size={17} color="#E7A1C5" />
          <Text style={styles.platformText}>Instagram</Text>
        </View>
        <View style={styles.platformChip}>
          <Ionicons name="logo-facebook" size={17} color="#83AFFF" />
          <Text style={styles.platformText}>Facebook</Text>
        </View>
      </View>

      <GoldButton
        title="GENERATE CONTENT PREVIEW"
        onPress={generatePreview}
        loading={loading}
        icon="sparkles"
      />

      <Notice message={notice} type="success" />

      {result ? (
        <View style={styles.resultArea}>
          <View style={styles.previewNotice}>
            <Ionicons name="information-circle-outline" size={18} color={C.gold} />
            <Text style={styles.previewNoticeText}>
              DEMO PREVIEW — Real AI video analysis will activate after backend integration.
            </Text>
          </View>

          <SectionTitle title="Your content preview" subtitle="Sample platform-specific output" />

          <View style={styles.resultCard}>
            <Text style={styles.resultPlatform}>YOUTUBE TITLE</Text>
            <Text style={styles.resultText}>{result.youtubeTitle}</Text>
            <View style={styles.resultDivider} />
            <Text style={styles.resultPlatform}>DESCRIPTION</Text>
            <Text style={styles.resultBody}>{result.youtubeDescription}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultPlatform}>INSTAGRAM CAPTION</Text>
            <Text style={styles.resultBody}>{result.instagramCaption}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultPlatform}>FACEBOOK POST</Text>
            <Text style={styles.resultBody}>{result.facebookCaption}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultPlatform}>SUGGESTED TAGS</Text>
            <Text style={styles.resultBody}>{result.tags.map((tag) => `#${tag}`).join('   ')}</Text>
          </View>

          <GoldButton title="SAVE SAMPLE PROJECT" onPress={saveProject} icon="bookmark-outline" />
        </View>
      ) : null}
    </ScrollView>
  );
}

function LibraryScreen({ projects }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Brand small />
      <Text style={[styles.pageTitle, { marginTop: 25 }]}>Your library.</Text>
      <Text style={styles.pageSubtitle}>All your saved projects in one place.</Text>
      {projects.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="file-tray-outline" size={30} color={C.muted} />
          <Text style={styles.emptyTitle}>No projects yet</Text>
          <Text style={styles.cardDescription}>Create a project to see it here.</Text>
        </View>
      ) : (
        projects.map((item) => (
          <View style={styles.projectRow} key={item.id}>
            <View style={styles.projectIcon}>
              <Ionicons name="videocam-outline" size={20} color={C.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription}>{item.date}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function ProfileScreen({ user, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logout = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;
    } catch (e) {
      setError(e?.message || 'Logout nahi ho paya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Brand small />
      <Text style={[styles.pageTitle, { marginTop: 25 }]}>Your profile.</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person-outline" size={30} color={C.goldLight} />
        </View>
        <Text style={styles.profileName}>Creator account</Text>
        <Text style={styles.profileEmail}>{user?.email || 'Email not available'}</Text>
      </View>

      <View style={styles.featureCard}>
        <Ionicons name="shield-checkmark-outline" size={22} color={C.gold} />
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Account security</Text>
          <Text style={styles.cardDescription}>Your account is managed through Supabase Authentication.</Text>
        </View>
      </View>

      <Notice message={error} type="error" />
      <OutlineButton title={loading ? 'Signing out...' : 'Sign out'} onPress={logout} icon="log-out-outline" />
      <Text style={styles.versionText}>REELVYA • EARLY ACCESS BUILD</Text>
    </ScrollView>
  );
}

function MainApp({ session }) {
  const [tab, setTab] = useState('home');
  const [projects, setProjects] = useState([]);

  const addProject = (project) => {
    setProjects((previous) => [project, ...previous]);
    setTab('library');
  };

  const tabs = [
    { key: 'home', label: 'Home', icon: 'home-outline' },
    { key: 'create', label: 'Create', icon: 'add-circle-outline' },
    { key: 'library', label: 'Library', icon: 'folder-outline' },
    { key: 'profile', label: 'Profile', icon: 'person-outline' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={{ flex: 1 }}>
        {tab === 'home' && (
          <HomeScreen
            onCreate={() => setTab('create')}
            projects={projects}
            userEmail={session?.user?.email}
          />
        )}
        {tab === 'create' && (
          <CreateScreen
            onSaved={addProject}
            onBack={() => setTab('home')}
          />
        )}
        {tab === 'library' && <LibraryScreen projects={projects} />}
        {tab === 'profile' && <ProfileScreen user={session?.user} />}
      </View>

      <View style={styles.bottomNav}>
        {tabs.map((item) => {
          const active = tab === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => setTab(item.key)}
              style={styles.navItem}
            >
              <Ionicons
                name={item.icon}
                size={21}
                color={active ? C.goldLight : C.muted}
              />
              <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [startupError, setStartupError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) setSession(data.session);
      } catch (error) {
        if (mounted) setStartupError(error?.message || 'Supabase connection error.');
      } finally {
        if (mounted) setChecking(false);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) setSession(newSession);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <Brand />
        <ActivityIndicator color={C.gold} size="large" style={{ marginTop: 25 }} />
        <Text style={styles.loadingText}>Preparing your workspace...</Text>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <View style={{ flex: 1 }}>
        <AuthScreen />
        {startupError ? (
          <View style={styles.startupError}>
            <Text style={styles.startupErrorText}>Connection: {startupError}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  return <MainApp session={session} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  loadingScreen: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: C.silver2, marginTop: 13, fontSize: 13, letterSpacing: 0.4 },

  brand: {
    color: C.silver,
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: 4.5,
    textShadowColor: '#FFFFFF88',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 9,
  },
  brandTag: {
    color: C.gold,
    fontSize: 8,
    letterSpacing: 2.4,
    marginTop: 4,
    fontWeight: '700',
  },
  logoMark: {
    width: 58,
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D8B97866',
    backgroundColor: '#D8B97812',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  authTop: { alignItems: 'center', marginTop: 35, marginBottom: 32 },
  authEyebrow: {
    color: C.muted,
    fontSize: 9,
    letterSpacing: 2.8,
    marginTop: 24,
    fontWeight: '700',
  },
  authScroll: { flexGrow: 1, paddingHorizontal: 22, paddingBottom: 30 },
  authCard: {
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 25,
    padding: 22,
  },
  eyebrow: { color: C.gold, fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  authTitle: { color: C.silver, fontSize: 28, fontWeight: '800', marginTop: 12 },
  subText: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 7 },
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: C.bg,
    borderRadius: 13,
    padding: 4,
    marginTop: 25,
    marginBottom: 22,
  },
  modeTab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  modeTabActive: { backgroundColor: C.panel2, borderWidth: 1, borderColor: C.border },
  modeText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  modeTextActive: { color: C.goldLight },
  fieldWrap: { marginBottom: 17 },
  fieldLabel: { color: C.silver2, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 9 },
  input: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    color: C.silver,
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#080B12',
    borderRadius: 11,
    padding: 11,
    marginBottom: 15,
  },
  noticeText: { flex: 1, fontSize: 12, lineHeight: 18, marginLeft: 8 },
  goldButton: {
    minHeight: 52,
    backgroundColor: C.gold,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 17,
    marginTop: 8,
  },
  buttonInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  goldButtonText: { color: '#17130B', fontWeight: '900', fontSize: 12, letterSpacing: 1.1 },
  authFoot: { color: C.muted, fontSize: 10, textAlign: 'center', lineHeight: 17, marginTop: 18 },
  footerText: { color: '#566173', fontSize: 9, letterSpacing: 2, textAlign: 'center', marginTop: 28 },

  screenContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 35 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 27 },
  avatar: {
    width: 39, height: 39, borderRadius: 14, borderWidth: 1,
    borderColor: C.border, backgroundColor: C.panel, alignItems: 'center', justifyContent: 'center',
  },
  welcomeBlock: {
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: '#9B855533',
    borderRadius: 23,
    padding: 22,
    marginBottom: 28,
  },
  heroTitle: { color: C.silver, fontSize: 37, fontWeight: '900', lineHeight: 43, marginTop: 12 },
  heroSubtitle: { color: C.silver2, fontSize: 13, lineHeight: 21, marginTop: 12, marginBottom: 17 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 14 },
  sectionTitle: { color: C.silver, fontSize: 17, fontWeight: '800' },
  sectionSubtitle: { color: C.muted, fontSize: 11, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 9, marginBottom: 18 },
  statCard: {
    flex: 1, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border,
    borderRadius: 15, padding: 13, minHeight: 108,
  },
  statValue: { color: C.silver, fontSize: 23, fontWeight: '800', marginTop: 10 },
  statLabel: { color: C.muted, fontSize: 10, marginTop: 3 },
  featureCard: {
    flexDirection: 'row', alignItems: 'center', gap: 13,
    backgroundColor: C.panel, borderWidth: 1, borderColor: C.border,
    borderRadius: 16, padding: 16, marginBottom: 25,
  },
  featureIcon: {
    width: 45, height: 45, borderRadius: 14, backgroundColor: '#D8B97818',
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { color: C.silver, fontSize: 13, fontWeight: '800' },
  cardDescription: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 5 },
  emptyCard: {
    alignItems: 'center', backgroundColor: C.panel, borderWidth: 1,
    borderColor: C.border, borderRadius: 17, padding: 24, marginBottom: 20,
  },
  emptyTitle: { color: C.silver, fontSize: 14, fontWeight: '800', marginTop: 12, marginBottom: 5 },
  outlineButton: {
    borderWidth: 1, borderColor: C.gold + '88', borderRadius: 12,
    minHeight: 45, paddingHorizontal: 15, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 15,
  },
  outlineButtonText: { color: C.goldLight, fontSize: 12, fontWeight: '700' },
  projectRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.panel,
    borderWidth: 1, borderColor: C.border, borderRadius: 14,
    padding: 13, marginBottom: 9,
  },
  projectIcon: {
    width: 42, height: 42, borderRadius: 13, backgroundColor: '#D8B97818',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  accountLine: { color: C.muted, fontSize: 10, marginTop: 17 },
  pageTitle: { color: C.silver, fontSize: 32, fontWeight: '900', lineHeight: 39, marginTop: 10 },
  pageSubtitle: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 8, marginBottom: 25 },
  backButton: {
    width: 38, height: 38, borderRadius: 13, backgroundColor: C.panel,
    borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center',
  },
  uploadBox: {
    borderWidth: 1, borderStyle: 'dashed', borderColor: '#D8B97888',
    borderRadius: 18, backgroundColor: C.panel, padding: 23,
    alignItems: 'center', marginBottom: 25,
  },
  uploadIcon: {
    width: 55, height: 55, borderRadius: 17, backgroundColor: '#D8B97818',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  uploadTitle: { color: C.silver, fontSize: 14, fontWeight: '800', textAlign: 'center' },
  uploadSub: { color: C.muted, fontSize: 10, textAlign: 'center', marginTop: 7 },
  uploadAction: { color: C.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 15 },
  hintInput: { minHeight: 90, textAlignVertical: 'top', marginBottom: 17 },
  platformRow: { flexDirection: 'row', gap: 7, marginBottom: 13 },
  platformChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border,
    borderRadius: 10, paddingVertical: 11,
  },
  platformText: { color: C.silver2, fontSize: 9, fontWeight: '700' },
  resultArea: { marginTop: 25 },
  previewNotice: {
    flexDirection: 'row', gap: 8, alignItems: 'center', padding: 12,
    borderWidth: 1, borderColor: '#D8B97855', borderRadius: 12,
    backgroundColor: '#D8B97810', marginBottom: 20,
  },
  previewNoticeText: { color: C.goldLight, fontSize: 10, lineHeight: 16, flex: 1 },
  resultCard: {
    backgroundColor: C.panel, borderWidth: 1, borderColor: C.border,
    borderRadius: 15, padding: 15, marginBottom: 10,
  },
  resultPlatform: { color: C.gold, fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 10 },
  resultText: { color: C.silver, fontSize: 15, fontWeight: '800', lineHeight: 22 },
  resultBody: { color: C.silver2, fontSize: 12, lineHeight: 19 },
  resultDivider: { height: 1, backgroundColor: C.border, marginVertical: 13 },
  profileCard: {
    alignItems: 'center', backgroundColor: C.panel, borderWidth: 1,
    borderColor: C.border, borderRadius: 19, padding: 24, marginTop: 22, marginBottom: 18,
  },
  profileAvatar: {
    width: 65, height: 65, borderRadius: 22, backgroundColor: '#D8B97818',
    borderWidth: 1, borderColor: '#D8B97866', alignItems: 'center', justifyContent: 'center',
  },
  profileName: { color: C.silver, fontSize: 17, fontWeight: '800', marginTop: 14 },
  profileEmail: { color: C.muted, fontSize: 12, marginTop: 6 },
  versionText: { color: '#566173', fontSize: 9, letterSpacing: 1.8, textAlign: 'center', marginTop: 30 },
  bottomNav: {
    flexDirection: 'row', backgroundColor: '#0E1420',
    borderTopWidth: 1, borderTopColor: C.border,
    paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 7 : 12,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  navLabel: { color: C.muted, fontSize: 9, fontWeight: '600' },
  navLabelActive: { color: C.goldLight, fontWeight: '900' },
  startupError: { backgroundColor: '#301719', padding: 8 },
  startupErrorText: { color: C.red, fontSize: 11 },
});