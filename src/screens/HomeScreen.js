import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [numQuestions, setNumQuestions] = useState('20');
  const [time, setTime] = useState('5');

  const handlePress = (screen, params) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (screen === 'Quiz' && params?.type === 'quick') {
      setModalVisible(true);
    } else if (params) {
      navigation.navigate(screen, params);
    } else {
      navigation.navigate(screen);
    }
  };

  const startCustomQuiz = () => {
    const questionCount = parseInt(numQuestions, 10);
    const timeLimit = parseInt(time, 10) * 60; // convert minutes to seconds

    if (isNaN(questionCount) || isNaN(timeLimit) || questionCount <= 0 || timeLimit <= 0) {
      alert('Please enter valid numbers for questions and time.');
      return;
    }

    setModalVisible(false);
    navigation.navigate('Quiz', {
      type: 'quick',
      numQuestions: questionCount,
      time: timeLimit,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4F8EF7', '#667eea']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>G1 Ready</Text>
          <Text style={styles.subtitle}>Ontario G1 Test Prep</Text>
          <TouchableOpacity
            style={styles.progressButton}
            onPress={() => handlePress('Progress')}
          >
            <Ionicons name="stats-chart" size={20} color="#4F8EF7" />
            <Text style={styles.progressText}>Progress</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="car" size={60} color="#4F8EF7" />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => handlePress('TestMode')}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="document-text" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Full Exam</Text>
              <Text style={styles.buttonSubtext}>40 Questions</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handlePress('Quiz', { type: 'quick' })}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="flash" size={24} color="#4F8EF7" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                5 Min Quiz
              </Text>
              <Text style={[styles.buttonSubtext, styles.secondaryButtonSubtext]}>
                20 Questions
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.studySection}>
            <Text style={styles.sectionTitle}>Study by Category</Text>
            <View style={styles.studyButtons}>
              <TouchableOpacity
                style={[styles.button, styles.studyButton]}
                onPress={() => handlePress('StudyMode', { type: 'signs' })}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="warning" size={20} color="#FF6B6B" />
                  <Text style={[styles.buttonText, styles.studyButtonText]}>
                    Road Signs
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.studyButton]}
                onPress={() => handlePress('StudyMode', { type: 'theory' })}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="book" size={20} color="#4ECDC4" />
                  <Text style={[styles.buttonText, styles.studyButtonText]}>
                    Theory
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Free forever • No ads • Offline ready
          </Text>
        </View>
      </LinearGradient>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Customize Quick Quiz</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNumQuestions}
              value={numQuestions}
              placeholder="Number of Questions"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              onChangeText={setTime}
              value={time}
              placeholder="Time in minutes"
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={startCustomQuiz}
            >
              <Text style={styles.textStyle}>Start Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonCancel: {
    backgroundColor: "#f44336",
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    borderRadius: 5,
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 15,
  },
  progressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#4F8EF7',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  button: {
    borderRadius: 16,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 20,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 5,
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 2,
  },
  secondaryButtonText: {
    color: '#4F8EF7',
  },
  secondaryButtonSubtext: {
    color: '#4F8EF7',
  },
  studySection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  studyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studyButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    marginHorizontal: 5,
  },
  studyButtonText: {
    fontSize: 14,
    color: '#333333',
    marginTop: 5,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
});

export default HomeScreen;
