import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getQuestionsByType } from '../data/questionBank';

const StudyModeScreen = ({ navigation, route }) => {
  const { type = 'signs' } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  const questions = getQuestionsByType(type);
  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const handleOptionPress = (index) => {
    setSelectedAnswer(index);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#4F8EF7', '#667eea']} style={styles.gradient}>
          <Text style={styles.noQuestionsText}>No questions available for this category</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4F8EF7', '#667eea']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {type === 'signs' ? 'Road Signs' : 'Theory'} Study
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Quiz', { type: 'quick' })}>
            <Ionicons name="play" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentIndex + 1} of {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / questions.length) * 100}%` }
              ]}
            />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            
            {currentQuestion.image && (
              <View style={styles.imageContainer}>
                <Image 
                  source={currentQuestion.image} 
                  style={styles.questionImage} 
                  resizeMode="contain" 
                />
              </View>
            )}

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    selectedAnswer === index && styles.selectedOption,
                    showAnswer && index === currentQuestion.correct && styles.correctOption,
                    showAnswer && index !== currentQuestion.correct && styles.incorrectOption
                  ]}
                  onPress={() => handleOptionPress(index)}
                >
                  <View style={[
                    styles.optionCircle,
                    selectedAnswer === index && styles.selectedCircle,
                    showAnswer && index === currentQuestion.correct && styles.correctCircle,
                    showAnswer && index !== currentQuestion.correct && styles.incorrectCircle
                  ]}>
                    <Text style={[
                      styles.optionLetter,
                      selectedAnswer === index && styles.selectedLetter,
                      showAnswer && index === currentQuestion.correct && styles.correctLetter,
                      showAnswer && index !== currentQuestion.correct && styles.incorrectLetter
                    ]}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedText,
                    showAnswer && index === currentQuestion.correct && styles.correctText,
                    showAnswer && index !== currentQuestion.correct && styles.incorrectText
                  ]}>
                    {option}
                  </Text>
                  {showAnswer && index === currentQuestion.correct && (
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {showAnswer && currentQuestion.explanation && (
              <View style={styles.explanationContainer}>
                <View style={styles.explanationHeader}>
                  <Ionicons name="bulb" size={20} color="#FFD700" />
                  <Text style={styles.explanationTitle}>Explanation</Text>
                </View>
                <Text style={styles.explanationText}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.revealButton, showAnswer && styles.hideButton]}
              onPress={toggleAnswer}
            >
              <Ionicons 
                name={showAnswer ? "eye-off" : "eye"} 
                size={20} 
                color="#ffffff" 
              />
              <Text style={styles.revealButtonText}>
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={currentIndex === 0 ? "#cccccc" : "#4F8EF7"} 
            />
            <Text style={[styles.navButtonText, currentIndex === 0 && styles.disabledText]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, currentIndex === questions.length - 1 && styles.disabledButton]}
            onPress={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            <Text style={[styles.navButtonText, currentIndex === questions.length - 1 && styles.disabledText]}>
              Next
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={currentIndex === questions.length - 1 ? "#cccccc" : "#4F8EF7"} 
            />
          </TouchableOpacity>
        </View>
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
  noQuestionsText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
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
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 26,
    marginBottom: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questionImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#4F8EF7',
  },
  correctOption: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#f8f9fa',
    opacity: 0.6,
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
  selectedCircle: {
    backgroundColor: '#4F8EF7',
  },
  correctCircle: {
    backgroundColor: '#4CAF50',
  },
  incorrectCircle: {
    backgroundColor: '#e0e0e0',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  selectedLetter: {
    color: '#ffffff',
  },
  correctLetter: {
    color: '#ffffff',
  },
  incorrectLetter: {
    color: '#666666',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  selectedText: {
    color: '#4F8EF7',
    fontWeight: '600',
  },
  correctText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  incorrectText: {
    color: '#666666',
  },
  explanationContainer: {
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  revealButton: {
    backgroundColor: '#4F8EF7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  hideButton: {
    backgroundColor: '#666666',
  },
  revealButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F8EF7',
    marginHorizontal: 5,
  },
  disabledText: {
    color: '#cccccc',
  },
});

export default StudyModeScreen;
