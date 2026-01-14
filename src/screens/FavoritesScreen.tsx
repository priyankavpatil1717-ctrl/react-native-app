import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../config/supabase';

const FavoritesScreen = ({ navigation }: any) => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select(
        `
        id,
        quotes (
          id,
          quote,
          author,
          category
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formatted = data.map(item => item.quotes);
      setFavorites(formatted);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>All Favorites ❤️</Text>

        <View style={{ width: 24 }} />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.center}>
          <Text>No favorites yet ❤️</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.quote}>"{item.quote}"</Text>
              <Text style={styles.author}>— {item.author}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* 🔹 Header styles */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  back: {
    fontSize: 22,
    fontWeight:"bold"
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4,
  },
  quote: {
    fontSize: 16,
    fontWeight: '600',
  },
  author: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  category: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
});
