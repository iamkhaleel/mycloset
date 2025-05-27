import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ResponsiveButton from '../../components/Button';
import {useState} from 'react';

const {width, height} = Dimensions.get('window');

const QuestionOne = () => {
  const navigation = useNavigation();

  const handleGoback = () => {
    navigation.goBack('Welcome');
  };

  const handleNext = () => {
    navigation.navigate('QuestionThree');
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    {label: 'App Store/Playstore', emoji: '📱'},
    {label: 'TikTok', emoji: '🎵'},
    {label: 'Instagram', emoji: '📸'},
    {label: 'Friends/Family', emoji: '👨‍👩‍👧‍👦'},
    {label: 'YouTube', emoji: '📺'},
    {label: 'Google', emoji: '🔍'},
    {label: 'Others', emoji: '❓'},
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoback} style={styles.backButton}>
            <Image
              source={require('../../assets/images/arrow-left.png')}
              resizeMode="contain"
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>How did you find us?</Text>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedOption(option.label)}
              style={[
                styles.option,
                selectedOption === option.label && styles.selectedOption,
              ]}>
              <View style={styles.optionContent}>
                <Text style={styles.emoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === option.label &&
                      styles.selectedOptionText,
                  ]}>
                  {option.label}
                </Text>
              </View>

              {selectedOption === option.label && (
                <Text style={styles.checkmark}>✔️</Text>
              )}
            </TouchableOpacity>
          ))}

          {selectedOption && (
            <ResponsiveButton
              onPress={handleNext}
              title={'Next'}
              buttonStyle={styles.nextButton}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.07,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backIcon: {
    width: width * 0.08,
    height: width * 0.08,
    maxWidth: 32,
    maxHeight: 32,
  },
  title: {
    fontSize: width * 0.06,
    maxFontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  optionsContainer: {
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.03,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.015,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#1e1e1e',
    backgroundColor: '#f2faff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: width * 0.06,
    marginRight: width * 0.03,
  },
  optionText: {
    fontSize: width * 0.04,
    color: '#1e1e1e',
    fontWeight: '400',
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  checkmark: {
    fontSize: width * 0.05,
    color: '#28a745',
  },
  nextButton: {
    height: height * 0.07,
    minHeight: 50,
    backgroundColor: '#000',
    borderRadius: 10,
    margin: 5,
    alignSelf: 'center',
    width: width * 0.9,
  },
});

export default QuestionOne;
