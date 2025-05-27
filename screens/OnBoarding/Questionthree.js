import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ResponsiveButton from '../../components/Button';
import {useState} from 'react';

const {width, height} = Dimensions.get('window');

const QuestionThree = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.navigate('SignUp');
  };

  const handleGoback = () => {
    navigation.goBack();
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    {label: 'Under 18'},
    {label: '18-24'},
    {label: '25-34'},
    {label: '35-44'},
    {label: '45-54'},
    {label: '55-65'},
    {label: '65+'},
    {label: 'prefer not to say'},
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

        <Text style={styles.title}>How old are you?</Text>

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
              onPress={handleContinue}
              title={'Continue'}
              buttonStyle={styles.continueButton}
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
  continueButton: {
    height: height * 0.07,
    minHeight: 50,
    backgroundColor: '#000',
    borderRadius: 10,
    margin: 5,
    alignSelf: 'center',
    width: width * 0.9,
  },
});

export default QuestionThree;
