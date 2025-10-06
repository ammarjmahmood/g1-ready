import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { saveQuizResult } from '../utils/storage';

const { width, height } = Dimensions.get('window');

const ResultsScreen = ({ navigation, route }) => {
  const { score, correct, total, answers, questions, type } = route.params;

  useEffect(() => {
    if (score >= 80) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    
    const incorrectQuestions = questions
      .filter((q, index) => answers[index] !== q.correctAnswer)
      .map(q => q.id);

    saveQuizResult({ score, correct, total, type, incorrectQuestions });
  }, [score]);

  const getScoreColor = () => {
    if (score >= 80) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  const getScoreMessage = () => {
    if (score >= 80) {
      return {
        title: 'Excellent!',
        message: type === 'quick' ? 'Great job on the quick quiz!' : 'You would pass the G1 test!',
        icon: 'checkmark-circle'
      };
    } else if (score >= 70) {
      return {
        title: 'Good Try!',
        message: 'You need 80% to pass. Keep practicing!',
        icon: 'warning'
      };
    } else {
      return {
        title: 'Keep Practicing!',
        message: 'Review the questions you missed and try again.',
        icon: 'close-circle'
      };
    }
  };

  const scoreInfo = getScoreMessage();

  const handleRetakeQuiz = () => {
    navigation.navigate('Quiz', { type });
  };

  const handleReviewAnswers = () => {
    navigation.navigate('ReviewAnswers', { answers, questions });
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4F8EF7', '#667eea']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoHome} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.resultContainer}>
            <View style={styles.scoreCircle}>
              <Ionicons 
                name={scoreInfo.icon} 
                size={60} 
                color={getScoreColor()} 
              />
              <Text style={[styles.scoreText, { color: getScoreColor() }]}>
                {score}%
              </Text>
            </View>

            <Text style={styles.titleText}>{scoreInfo.title}</Text>
            <Text style={styles.messageText}>{scoreInfo.message}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="checkmark" size={24} color="#4CAF50" />
                <Text style={styles.statNumber}>{correct}</Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="close" size={24} color="#F44336" />
                <Text style={styles.statNumber}>{total - correct}</Text>
                <Text style={styles.statLabel}>Incorrect</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="document-text" size={24} color="#4F8EF7" />
                <Text style={styles.statNumber}>{total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <Text style={styles.progressLabel}>Your Score</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${score}%`,
                      backgroundColor: getScoreColor()
                    }
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressText}>0%</Text>
                <Text style={[styles.progressText, styles.passText]}>80% (Pass)</Text>
                <Text style={styles.progressText}>100%</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleRetakeQuiz}
            >
              <Ionicons name="refresh" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleReviewAnswers}
            >
              <Ionicons name="eye" size={20} color="#4F8EF7" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Review Answers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.tertiaryButton]}
              onPress={handleGoHome}
            >
              <Ionicons name="home" size={20} color="#666666" />
              <Text style={[styles.buttonText, styles.tertiaryButtonText]}>
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipContainer}>
            <Ionicons name="bulb" size={20} color="#FFD700" />
            <Text style={styles.tipText}>
              {score >= 80 
                ? "You're ready for the real test! Keep practicing to maintain your skills."
                : "Focus on studying the questions you missed. Practice makes perfect!"
              }
            </Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeButton: {
    padding: 5,
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    
    marginTop: 5,
  },
  titleText: {
    fontSize: 28,
    
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    
    color: '#333333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    
    color: '#666666',
    marginTop: 2,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    
    color: '#666666',
  },
  passText: {
    color: '#4CAF50',
    
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#4F8EF7',
  },
  tertiaryButton: {
    backgroundColor: '#f8f9fa',
  },
  buttonText: {
    fontSize: 16,
    
    color: '#ffffff',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#4F8EF7',
  },
  tertiaryButtonText: {
    color: '#666666',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    
    color: '#333333',
    lineHeight: 20,
    marginLeft: 10,
  },
});

export default ResultsScreen;
