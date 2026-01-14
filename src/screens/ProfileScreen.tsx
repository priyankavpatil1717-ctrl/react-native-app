import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { supabase } from '../config/supabase';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (!error && data) {
      setName(data.name || '');
      setAvatar(data.avatar_url || '');
    }
  };

 const updateProfile = async () => {
  setLoading(true);

  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data?.user) {
    setLoading(false);
    Alert.alert('Error', 'User not logged in');
    return;
  }

  const user = data.user;

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    name,
    avatar_url: avatar,
    updated_at: new Date().toISOString(),
  });

  setLoading(false);

  if (error) {
    Alert.alert('Error', error.message);
  } else {
    Alert.alert('Success', 'Profile updated');
  }
};

  const logout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text>Avatar</Text>
        </View>
      )}

      <TextInput
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Avatar Image URL"
        value={avatar}
        onChangeText={setAvatar}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={updateProfile}>
        <Text style={styles.btnText}>
          {loading ? 'Saving...' : 'Save Profile'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={{ color: 'red' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  btnText: { color: '#fff', textAlign: 'center' },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logout: { marginTop: 24, alignItems: 'center' },
});
