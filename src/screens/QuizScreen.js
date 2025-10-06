import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getRandomQuestions, getQuickQuizQuestions } from '../data/questionBank';

const { width, height } = Dimensions.get('window');

const QuizScreen = ({ navigation, route }) => {
  const { type = 'full', numQuestions, time } = route.params || {};
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(time || (type === 'quick' ? 300 : 1800));
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const questionSet = type === 'quick' ? getQuickQuizQuestions(numQuestions) : getRandomQuestions();
    setQuestions(questionSet);
  }, [type, numQuestions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeUp = () => {
    Alert.alert(
      'Time Up!',
      'Your time has expired. The quiz will be submitted automatically.',
      [{ text: 'OK', onPress: submitQuiz }]
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAnswer(index);

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = index;
    setUserAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(newAnswers[currentQuestion + 1] || null);
      } else {
        submitQuiz(newAnswers);
      }
    }, 500); // 500ms delay
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1] || null);
    }
  };

  const submitQuiz = (answers = userAnswers) => {
    const finalAnswers = [...answers];
    if (selectedAnswer !== null && finalAnswers[currentQuestion] === undefined) {
      finalAnswers[currentQuestion] = selectedAnswer;
    }

    const correctAnswers = questions.filter((q, index) => 
      finalAnswers[index] === q.correct
    ).length;

    const percentage = Math.round((correctAnswers / questions.length) * 100);

    navigation.navigate('Results', {
      score: percentage,
      correct: correctAnswers,
      total: questions.length,
      answers: finalAnswers,
      questions: questions,
      type: type
    });
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Quiz',
      'Are you sure you want to exit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => navigation.goBack() }
      ]
    );
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#4F8EF7', '#667eea']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading questions...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const question = questions[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4F8EF7', '#667eea']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentQuestion + 1} of {questions.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
                ]}
              />
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Ionicons name="time" size={16} color="#ffffff" />
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            
            {question.image && (
              <View style={styles.imageContainer}>
                <Image source={question.image} style={styles.questionImage} resizeMode="contain" />
              </View>
            )}

            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === index && styles.selectedOption
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.optionCircle,
                      selectedAnswer === index && styles.selectedCircle
                    ]}>
                      <Text style={[
                        styles.optionLetter,
                        selectedAnswer === index && styles.selectedLetter
                      ]}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={[
                      styles.optionText,
                      selectedAnswer === index && styles.selectedOptionText
                    ]}>
                      {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestion === 0 && styles.disabledButton]}
            onPress={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <Ionicons name="chevron-back" size={24} color={currentQuestion === 0 ? "#cccccc" : "#4F8EF7"} />
            <Text style={[styles.navButtonText, currentQuestion === 0 && styles.disabledText]}>
              Previous
            </Text>
          </TouchableOpacity>

          {currentQuestion === questions.length - 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={() => submitQuiz()}
            >
              <Text style={styles.nextButtonText}>Submit</Text>
              <Ionicons name="checkmark" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    
    color: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  exitButton: {
    padding: 5,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  progressText: {
    fontSize: 14,
    
    color: '#ffffff',
    marginBottom: 5,
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    
    color: '#ffffff',
    marginLeft: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  questionText: {
    fontSize: 18,
    
    color: '#333333',
    lineHeight: 26,
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
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
    borderColor: '#4F8EF7',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectedCircle: {
    backgroundColor: '#4F8EF7',
  },
  optionLetter: {
    fontSize: 14,
    
    color: '#666666',
  },
  selectedLetter: {
    color: '#ffffff',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    
    color: '#333333',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#4F8EF7',
    
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
  nextButton: {
    backgroundColor: '#FF6B6B',
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
  },
  navButtonText: {
    fontSize: 16,
    
    color: '#4F8EF7',
    marginLeft: 5,
  },
  nextButtonText: {
    fontSize: 16,
    
    color: '#ffffff',
    marginRight: 5,
  },
  disabledText: {
    color: '#cccccc',
  },
});

export default QuizScreen;
