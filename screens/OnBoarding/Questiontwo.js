import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ResponsiveButton from '../../components/Button';
import {useState} from 'react';

const QuestionTwo = () => {
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
    <SafeAreaView>
      <View styles={styles.logo}>
        <Image
          source={require('../../assets/images/arrow-left.png')}
          resizeMode="contain"
          style={{
            width: 120,
            height: 120,
          }}
        />
      </View>

      <Text style={styles.title}>How did you find us?</Text>
      <View style={{marginVertical: 20, paddingHorizontal: 10}}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedOption(option.label)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 14,
              paddingHorizontal: 16,
              marginBottom: 12,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: selectedOption === option.label ? '#1e1e1e' : '#ccc',
              backgroundColor:
                selectedOption === option.label ? '#f2faff' : '#fff',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 20, marginRight: 12}}>
                {option.emoji}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#1e1e1e',
                  fontWeight: selectedOption === option.label ? '600' : '400',
                }}>
                {option.label}
              </Text>
            </View>

            {selectedOption === option.label && (
              <Text style={{fontSize: 18, color: '#28a745'}}>✔️</Text>
            )}
          </TouchableOpacity>
        ))}

        {selectedOption && (
          <ResponsiveButton
            onPress={() => console.log('Next clicked with:', selectedOption)}
            title={'Next'}
            buttonStyle={{
              height: '10%', // 👈 force custom height
              backgroundColor: '#000', // 👈 override color
              borderRadius: 10, // 👈 override anything
              margin: 5,
              alignSelf: 'center',
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    marginStart: 15,
  },
});

export default QuestionTwo;
