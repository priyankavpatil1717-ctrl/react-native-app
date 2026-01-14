import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../config/supabase';

const PAGE_SIZE = 10;
const categories = ['All', 'Motivation', 'Love', 'Success', 'Wisdom', 'Humor'];

const HomeScreen = ({ navigation }: any) => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [quoteOfTheDay, setQuoteOfTheDay] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  /* ---------------- FAVORITES ---------------- */
  const fetchFavorites = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const { data } = await supabase
      .from('favorites')
      .select('quote_id')
      .eq('user_id', userData.user.id);

    if (data) setFavorites(data.map(i => i.quote_id));
  };

  const toggleFavorite = async (quoteId: number) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    if (favorites.includes(quoteId)) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('quote_id', quoteId);

      setFavorites(prev => prev.filter(id => id !== quoteId));
    } else {
      await supabase.from('favorites').insert({
        user_id: userData.user.id,
        quote_id: quoteId,
      });

      setFavorites(prev => [...prev, quoteId]);
    }
  };

  /* ---------------- FETCH QUOTES (FIXED) ---------------- */
  const fetchQuotes = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;

      if (reset) {
        setLoading(true);
        setQuotes([]);
        setPage(0);
        setHasMore(true);
      }

      const currentPage = reset ? 0 : page;
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      // ✅ category filter
      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      // ✅ search filter
      if (searchText.trim()) {
        query = query.or(
          `quote.ilike.%${searchText}%,author.ilike.%${searchText}%`
        );
      }

      const { data } = await query;

      if (data) {
        setQuotes(prev => (reset ? data : [...prev, ...data]));
        setPage(prev => prev + 1);
        if (data.length < PAGE_SIZE) setHasMore(false);
      }

      setLoading(false);
    },
    [page, selectedCategory, searchText, hasMore]
  );

  /* ---------------- QUOTE OF THE DAY ---------------- */
  const fetchQuoteOfTheDay = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('quotes').select('*');

    if (data?.length) {
      const index =
        today
          .split('-')
          .join('')
          .split('')
          .reduce((a, b) => a + Number(b), 0) % data.length;

      setQuoteOfTheDay(data[index]);
    }
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    fetchQuotes(true); // ✅ category or search change la proper reload
  }, [selectedCategory, searchText]);

  useEffect(() => {
    fetchFavorites();
    fetchQuoteOfTheDay();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchQuotes(true);
    await fetchFavorites();
    await fetchQuoteOfTheDay();
    setRefreshing(false);
  };

  /* ---------------- RENDER ITEM ---------------- */
  const renderItem = ({ item }: any) => {
    const isFav = favorites.includes(item.id);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.heart}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={{ fontSize: 22 }}>{isFav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        <Text style={styles.quoteText}>"{item.quote}"</Text>
        <Text style={styles.author}>— {item.author}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    );
  };

  return (
    <>
      {/* HEADER */}
     <View style={styles.header}>
  <Text style={styles.headerTitle}>QuoteVault</Text>

  <View style={styles.headerRight}>
    <TouchableOpacity
      onPress={() => navigation.navigate('Favorites')}
      style={styles.headerBtn}
    >
      <Text style={styles.headerIcon}>❤️</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => navigation.navigate('Profile')}
      style={styles.headerBtn}
    >
      <Text style={styles.headerIcon}>👤</Text>
    </TouchableOpacity>
  </View>
</View>

      {/* QUOTE OF THE DAY */}
      {quoteOfTheDay && (
        <View style={styles.qodCard}>
          <Text style={styles.qodTitle}>🌟 Quote of the Day</Text>
          <Text style={styles.qodQuote}>"{quoteOfTheDay.quote}"</Text>
          <Text style={styles.qodAuthor}>— {quoteOfTheDay.author}</Text>
        </View>
      )}

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search quote or author..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.input}
        />
      </View>

      {/* CATEGORY TABS */}
      <View>
<FlatList
        horizontal
        data={categories}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryBtn,
              selectedCategory === item && styles.activeCategory,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={{
                color: selectedCategory === item ? '#fff' : '#000',
                fontWeight: '600',
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
      </View>
      

      {/* QUOTES LIST */}
      <FlatList
        data={quotes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => fetchQuotes()}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          loading && <ActivityIndicator style={{ marginVertical: 16 }} />
        }
      />
    </>
  );
};

export default HomeScreen;


/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

 header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingTop: 50,
  paddingBottom: 12,
  backgroundColor: '#fff',
  elevation: 6,
  zIndex: 10,            // 👈 MOST IMPORTANT
},

headerTitle: {
  fontSize: 22,
  fontWeight: 'bold',
},

headerRight: {
  flexDirection: 'row',
  alignItems: 'center',
},

headerBtn: {
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 8,
},

headerIcon: {
  fontSize: 26,
},

  
    headerIcons: {
    fontSize: 26,
    marginLeft: 5,
  },
heartBtn: {
  position: 'absolute',
  top: 8,
  right: 8,
  width: 44,
  height: 44,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.05)', // optional
},

heartIcon: {
  fontSize: 22,
},
  qodCard: {
    backgroundColor: '#000',
    margin: 16,
    padding: 18,
    borderRadius: 16,
  },

  qodTitle: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 8,
  },

  qodQuote: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  qodAuthor: {
    color: '#ccc',
    marginTop: 8,
    fontStyle: 'italic',
  },

  searchBox: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
  },

  categoryList: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },

  categoryBtn: {
    height: 38,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 19,
    backgroundColor: '#eee',
    marginHorizontal: 4,
  },

  activeCategory: {
    backgroundColor: '#000',
  },

  listContent: {
    padding: 16,
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4,
  },

 heart: {
  position: 'absolute',
  top: 12,
  right: 12,
  height: 50,
  width: 50,
  borderRadius: 25,          // 👈 round button
  backgroundColor: '#ffffff',
  justifyContent: 'center',  // 👈 vertical center
  alignItems: 'center',      // 👈 horizontal center
},


  quoteText: {
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
