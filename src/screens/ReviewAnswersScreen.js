import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ReviewAnswersScreen = ({ navigation, route }) => {
  const { answers, questions } = route.params;

  const isCorrect = (questionIndex) => {
    return answers[questionIndex] === questions[questionIndex].correct;
  };

  const getSummary = () => {
    const correct = questions.filter((q, i) => isCorrect(i)).length;
    const incorrect = questions.length - correct;
    return { correct, incorrect };
  };

  const { correct, incorrect } = getSummary();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4F8EF7', '#667eea']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Answers</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.summaryText}>{correct} Correct</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="close-circle" size={20} color="#F44336" />
            <Text style={styles.summaryText}>{incorrect} Incorrect</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {questions.map((question, questionIndex) => {
            const userAnswer = answers[questionIndex];
            const correctAnswer = question.correct;
            const answeredCorrectly = isCorrect(questionIndex);

            return (
              <View 
                key={questionIndex} 
                style={[
                  styles.questionCard,
                  answeredCorrectly ? styles.correctCard : styles.incorrectCard
                ]}
              >
                <View style={styles.questionHeader}>
                  <View style={styles.questionNumberContainer}>
                    <Text style={styles.questionNumber}>
                      Question {questionIndex + 1}
                    </Text>
                    <Ionicons 
                      name={answeredCorrectly ? "checkmark-circle" : "close-circle"} 
                      size={24} 
                      color={answeredCorrectly ? "#4CAF50" : "#F44336"} 
                    />
                  </View>
                </View>

                <Text style={styles.questionText}>{question.question}</Text>

                {question.image && (
                  <View style={styles.imageContainer}>
                    <Image 
                      source={question.image} 
                      style={styles.questionImage} 
                      resizeMode="contain" 
                    />
                  </View>
                )}

                <View style={styles.optionsContainer}>
                  {question.options.map((option, optionIndex) => {
                    const isUserAnswer = userAnswer === optionIndex;
                    const isCorrectOption = correctAnswer === optionIndex;
                    
                    let optionStyle = styles.optionItem;
                    let circleStyle = styles.optionCircle;
                    let letterStyle = styles.optionLetter;
                    let textStyle = styles.optionText;

                    if (isCorrectOption) {
                      optionStyle = [styles.optionItem, styles.correctOption];
                      circleStyle = [styles.optionCircle, styles.correctCircle];
                      letterStyle = [styles.optionLetter, styles.correctLetter];
                      textStyle = [styles.optionText, styles.correctText];
                    } else if (isUserAnswer && !answeredCorrectly) {
                      optionStyle = [styles.optionItem, styles.wrongOption];
                      circleStyle = [styles.optionCircle, styles.wrongCircle];
                      letterStyle = [styles.optionLetter, styles.wrongLetter];
                      textStyle = [styles.optionText, styles.wrongText];
                    }

                    return (
                      <View key={optionIndex} style={optionStyle}>
                        <View style={circleStyle}>
                          <Text style={letterStyle}>
                            {String.fromCharCode(65 + optionIndex)}
                          </Text>
                        </View>
                        <Text style={textStyle}>{option}</Text>
                        {isCorrectOption && (
                          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        )}
                        {isUserAnswer && !answeredCorrectly && (
                          <Ionicons name="close-circle" size={20} color="#F44336" />
                        )}
                      </View>
                    );
                  })}
                </View>

                {!answeredCorrectly && (
                  <View style={styles.feedbackContainer}>
                    <View style={styles.feedbackHeader}>
                      <Ionicons name="information-circle" size={18} color="#F44336" />
                      <Text style={styles.feedbackTitle}>Your Answer</Text>
                    </View>
                    <Text style={styles.feedbackText}>
                      You selected: {question.options[userAnswer]}
                    </Text>
                    <Text style={styles.feedbackText}>
                      Correct answer: {question.options[correctAnswer]}
                    </Text>
                  </View>
                )}

                {question.explanation && (
                  <View style={styles.explanationContainer}>
                    <View style={styles.explanationHeader}>
                      <Ionicons name="bulb" size={18} color="#FFD700" />
                      <Text style={styles.explanationTitle}>Explanation</Text>
                    </View>
                    <Text style={styles.explanationText}>
                      {question.explanation}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}

          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="home" size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Back to Home</Text>
            </TouchableOpacity>
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
    fontWeight: '600',
    color: '#ffffff',
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingVertical: 12,
    borderRadius: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 4,
  },
  correctCard: {
    borderLeftColor: '#4CAF50',
  },
  incorrectCard: {
    borderLeftColor: '#F44336',
  },
  questionHeader: {
    marginBottom: 12,
  },
  questionNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 24,
    marginBottom: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questionImage: {
    width: width * 0.6,
    height: 150,
    borderRadius: 12,
  },
  optionsContainer: {
    marginBottom: 15,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
  },
  correctOption: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  optionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  correctCircle: {
    backgroundColor: '#4CAF50',
  },
  wrongCircle: {
    backgroundColor: '#F44336',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  correctLetter: {
    color: '#ffffff',
  },
  wrongLetter: {
    color: '#ffffff',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    lineHeight: 20,
  },
  correctText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  wrongText: {
    color: '#F44336',
    fontWeight: '600',
  },
  feedbackContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  feedbackText: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
    marginBottom: 4,
  },
  explanationContainer: {
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 20,
  },
  bottomActions: {
    marginTop: 10,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#4F8EF7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
});

export default ReviewAnswersScreen;
