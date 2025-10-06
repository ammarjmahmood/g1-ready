import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const TestModeScreen = ({ navigation }) => {
  const handleStartTest = (type) => {
    navigation.navigate('Quiz', { type });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4F8EF7', '#667eea']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Practice Tests</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.testOption}>
            <View style={styles.testHeader}>
              <Ionicons name="document-text" size={32} color="#4F8EF7" />
              <Text style={styles.testTitle}>Full G1 Exam</Text>
            </View>
            <Text style={styles.testDescription}>
              Complete practice exam with 40 questions, just like the real G1 test. 
              You have 30 minutes to complete all questions.
            </Text>
            <View style={styles.testDetails}>
              <View style={styles.detail}>
                <Ionicons name="help-circle" size={16} color="#666666" />
                <Text style={styles.detailText}>40 Questions</Text>
              </View>
              <View style={styles.detail}>
                <Ionicons name="time" size={16} color="#666666" />
                <Text style={styles.detailText}>30 Minutes</Text>
              </View>
              <View style={styles.detail}>
                <Ionicons name="checkmark-circle" size={16} color="#666666" />
                <Text style={styles.detailText}>80% to Pass</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => handleStartTest('full')}
            >
              <Text style={styles.startButtonText}>Start Full Exam</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.testOption}>
            <View style={styles.testHeader}>
              <Ionicons name="flash" size={32} color="#FF6B6B" />
              <Text style={styles.testTitle}>5 Minute Quiz</Text>
            </View>
            <Text style={styles.testDescription}>
              Quick practice session with 20 questions (10 signs + 10 theory). 
              Perfect for a quick review or when you're short on time.
            </Text>
            <View style={styles.testDetails}>
              <View style={styles.detail}>
                <Ionicons name="help-circle" size={16} color="#666666" />
                <Text style={styles.detailText}>20 Questions</Text>
              </View>
              <View style={styles.detail}>
                <Ionicons name="time" size={16} color="#666666" />
                <Text style={styles.detailText}>5 Minutes</Text>
              </View>
              <View style={styles.detail}>
                <Ionicons name="pie-chart" size={16} color="#666666" />
                <Text style={styles.detailText}>Mixed Topics</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.startButton, styles.quickButton]}
              onPress={() => handleStartTest('quick')}
            >
              <Text style={styles.startButtonText}>Start Quick Quiz</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#4F8EF7" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Test Tips</Text>
              <Text style={styles.infoText}>
                • Read each question carefully{'\n'}
                • Look for key words like "must", "should", "never"{'\n'}
                • When in doubt, choose the safest option{'\n'}
                • Practice regularly for best results
              </Text>
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
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  testOption: {
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
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  testTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 15,
  },
  testDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 15,
  },
  testDetails: {
    marginBottom: 20,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 8,
  },
  startButton: {
    backgroundColor: '#4F8EF7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  quickButton: {
    backgroundColor: '#FF6B6B',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
});

export default TestModeScreen;
