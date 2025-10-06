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
  Linking,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);
  const [numQuestions, setNumQuestions] = useState(20);
  const [time, setTime] = useState(5);

  const questionOptions = [10, 15, 20, 25, 30];
  const timeOptions = [1, 2, 5, 10, 15, 20];

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
    setModalVisible(false);
    navigation.navigate('Quiz', {
      type: 'quick',
      numQuestions: numQuestions,
      time: time * 60, // convert minutes to seconds
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4F8EF7', '#667eea']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.infoButton} onPress={() => setDisclaimerVisible(true)}>
              <Ionicons name="information-circle-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.title}>G1 Ready</Text>
              <Text style={styles.subtitle}>Ontario G1 Test Prep</Text>
            </View>
            <View style={{ width: 24 }} />
          </View>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Customize Quiz</Text>
            
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={numQuestions}
                style={styles.picker}
                onValueChange={(itemValue) => setNumQuestions(itemValue)}
              >
                {questionOptions.map(val => <Picker.Item key={val} label={`${val} Questions`} value={val} />)}
              </Picker>
            </View>

            <View style={styles.timePickerContainer}>
              <Picker
                selectedValue={time}
                style={styles.picker}
                onValueChange={(itemValue) => setTime(itemValue)}
              >
                {timeOptions.map(val => <Picker.Item key={val} label={`${val} Minutes`} value={val} />)}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={startCustomQuiz}
            >
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={disclaimerVisible}
        onRequestClose={() => setDisclaimerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              This app is for educational and practice purposes only. It is not affiliated with, endorsed by, or representing the Ontario Ministry of Transportation (MTO) or any other government agency.
            </Text>
            <Text style={styles.disclaimerText}>
              The practice questions are based on the Ontario Driver’s Handbook and are designed to help users study for the G1 written knowledge test.
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.ontario.ca/page/driving-and-roads')}>
              <Text style={styles.linkText}>
                For official information, resources, and licensing requirements, please visit the MTO website.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDisclaimerVisible(false)}
            >
              <Text style={styles.startButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 15,
  },
  timePickerContainer: {
    width: '100%',
    marginBottom: 15,
    marginTop: 30,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    height: 120,
  },
  startButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
    marginTop: 10,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  infoButton: {
    padding: 5,
  },
  disclaimerText: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
    lineHeight: 20,
  },
  linkText: {
    color: '#4F8EF7',
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
    marginTop: 20,
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
