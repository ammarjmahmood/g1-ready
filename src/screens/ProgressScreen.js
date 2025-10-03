import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getQuizStats, clearAllData } from '../utils/storage';

const ProgressScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    recentQuizzes: [],
    signsPracticed: 0,
    theoryPracticed: 0,
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const statsData = await getQuizStats();
    setStats(statsData);
  };

  const clearProgress = async () => {
    const success = await clearAllData();
    if (success) {
      setStats({
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        recentQuizzes: [],
        signsPracticed: 0,
        theoryPracticed: 0,
      });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  const getPerformanceMessage = () => {
    if (stats.averageScore >= 80) {
      return {
        message: "Excellent! You're ready for the real test!",
        icon: 'trophy',
        color: '#4CAF50'
      };
    } else if (stats.averageScore >= 70) {
      return {
        message: "Good progress! Keep practicing to reach 80%.",
        icon: 'trending-up',
        color: '#FF9800'
      };
    } else {
      return {
        message: "Keep practicing! You're improving with each quiz.",
        icon: 'school',
        color: '#4F8EF7'
      };
    }
  };

  const performance = getPerformanceMessage();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4F8EF7', '#667eea']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <TouchableOpacity onPress={clearProgress}>
            <Ionicons name="refresh" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.overviewCard}>
            <View style={styles.performanceSection}>
              <Ionicons name={performance.icon} size={40} color={performance.color} />
              <Text style={styles.performanceMessage}>{performance.message}</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalQuizzes}</Text>
                <Text style={styles.statLabel}>Quizzes Taken</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: getScoreColor(stats.averageScore) }]}>
                  {stats.averageScore}%
                </Text>
                <Text style={styles.statLabel}>Average Score</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: getScoreColor(stats.bestScore) }]}>
                  {stats.bestScore}%
                </Text>
                <Text style={styles.statLabel}>Best Score</Text>
              </View>
            </View>
          </View>

          <View style={styles.categoryCard}>
            <Text style={styles.cardTitle}>Practice by Category</Text>
            <View style={styles.categoryStats}>
              <View style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Ionicons name="warning" size={24} color="#FF6B6B" />
                  <Text style={styles.categoryTitle}>Road Signs</Text>
                </View>
                <Text style={styles.categoryCount}>{stats.signsPracticed} questions practiced</Text>
                <TouchableOpacity 
                  style={[styles.practiceButton, { backgroundColor: '#FF6B6B' }]}
                  onPress={() => navigation.navigate('StudyMode', { type: 'signs' })}
                >
                  <Text style={styles.practiceButtonText}>Practice Signs</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Ionicons name="book" size={24} color="#4ECDC4" />
                  <Text style={styles.categoryTitle}>Theory</Text>
                </View>
                <Text style={styles.categoryCount}>{stats.theoryPracticed} questions practiced</Text>
                <TouchableOpacity 
                  style={[styles.practiceButton, { backgroundColor: '#4ECDC4' }]}
                  onPress={() => navigation.navigate('StudyMode', { type: 'theory' })}
                >
                  <Text style={styles.practiceButtonText}>Practice Theory</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {stats.recentQuizzes.length > 0 && (
            <View style={styles.recentCard}>
              <Text style={styles.cardTitle}>Recent Quiz Results</Text>
              {stats.recentQuizzes.slice(0, 5).map((quiz, index) => (
                <View key={index} style={styles.recentItem}>
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentType}>
                      {quiz.type === 'quick' ? '5 Min Quiz' : 'Full Exam'}
                    </Text>
                    <Text style={styles.recentDate}>{quiz.date}</Text>
                  </View>
                  <View style={styles.recentScore}>
                    <Text style={[styles.recentScoreText, { color: getScoreColor(quiz.score) }]}>
                      {quiz.score}%
                    </Text>
                    <Text style={styles.recentDetails}>
                      {quiz.correct}/{quiz.total}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.achievementsCard}>
            <Text style={styles.cardTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              <View style={[styles.achievement, stats.totalQuizzes >= 1 && styles.achievementUnlocked]}>
                <Ionicons 
                  name="play-circle" 
                  size={24} 
                  color={stats.totalQuizzes >= 1 ? '#4CAF50' : '#cccccc'} 
                />
                <Text style={[styles.achievementText, stats.totalQuizzes >= 1 && styles.achievementTextUnlocked]}>
                  First Quiz Complete
                </Text>
              </View>
              
              <View style={[styles.achievement, stats.bestScore >= 80 && styles.achievementUnlocked]}>
                <Ionicons 
                  name="trophy" 
                  size={24} 
                  color={stats.bestScore >= 80 ? '#FFD700' : '#cccccc'} 
                />
                <Text style={[styles.achievementText, stats.bestScore >= 80 && styles.achievementTextUnlocked]}>
                  Pass the Test (80%+)
                </Text>
              </View>

              <View style={[styles.achievement, stats.totalQuizzes >= 10 && styles.achievementUnlocked]}>
                <Ionicons 
                  name="medal" 
                  size={24} 
                  color={stats.totalQuizzes >= 10 ? '#FF6B6B' : '#cccccc'} 
                />
                <Text style={[styles.achievementText, stats.totalQuizzes >= 10 && styles.achievementTextUnlocked]}>
                  Practice Makes Perfect (10 quizzes)
                </Text>
              </View>

              <View style={[styles.achievement, stats.averageScore >= 90 && styles.achievementUnlocked]}>
                <Ionicons 
                  name="star" 
                  size={24} 
                  color={stats.averageScore >= 90 ? '#4F8EF7' : '#cccccc'} 
                />
                <Text style={[styles.achievementText, stats.averageScore >= 90 && styles.achievementTextUnlocked]}>
                  Top Performer (90% average)
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  overviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  performanceSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceMessage: {
    fontSize: 16,
    
    color: '#333333',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    
    color: '#4F8EF7',
  },
  statLabel: {
    fontSize: 12,
    
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 18,
    
    color: '#333333',
    marginBottom: 15,
  },
  categoryStats: {
    gap: 15,
  },
  categoryItem: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    
    color: '#333333',
    marginLeft: 10,
  },
  categoryCount: {
    fontSize: 13,
    
    color: '#666666',
    marginBottom: 10,
  },
  practiceButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  practiceButtonText: {
    fontSize: 12,
    
    color: '#ffffff',
  },
  recentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentInfo: {
    flex: 1,
  },
  recentType: {
    fontSize: 14,
    
    color: '#333333',
  },
  recentDate: {
    fontSize: 12,
    
    color: '#666666',
    marginTop: 2,
  },
  recentScore: {
    alignItems: 'flex-end',
  },
  recentScoreText: {
    fontSize: 16,
    
  },
  recentDetails: {
    fontSize: 12,
    
    color: '#666666',
    marginTop: 2,
  },
  achievementsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  achievementsList: {
    gap: 12,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  achievementUnlocked: {
    backgroundColor: '#E8F5E8',
  },
  achievementText: {
    fontSize: 14,
    
    color: '#cccccc',
    marginLeft: 12,
  },
  achievementTextUnlocked: {
    color: '#333333',
    
  },
});

export default ProgressScreen;