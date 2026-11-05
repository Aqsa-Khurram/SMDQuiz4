import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function App() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // {ok: bool, text: string}

  const sendOtp = async () => {
    if (!/^\+\d{8,15}$/.test(phone)) {
      return setStatus({ ok: false, text: 'Use international format, e.g. +923001234567' });
    }
    setLoading(true); setStatus(null);
    try {
      const result = await auth().signInWithPhoneNumber(phone);
      setConfirmation(result);
      setStatus({ ok: true, text: 'OTP sent via SMS' });
    } catch (e) {
      setStatus({ ok: false, text: e.message });
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true); setStatus(null);
    try {
      await confirmation.confirm(code);
      setStatus({ ok: true, text: '✅ Phone number verified successfully!' });
      setConfirmation(null);
    } catch (e) {
      setStatus({ ok: false, text: '❌ Invalid OTP. Verification failed.' });
    }
    setLoading(false);
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Verify your phone</Text>

      {!confirmation ? (
        <>
          <TextInput style={s.input} placeholder="+923001234567"
            keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <Btn title="Send OTP" onPress={sendOtp} loading={loading} />
        </>
      ) : (
        <>
          <Text style={s.label}>Enter the code sent to {phone}</Text>
          <TextInput style={[s.input, { textAlign: 'center', letterSpacing: 8 }]}
            placeholder="------" keyboardType="number-pad" maxLength={6}
            value={code} onChangeText={setCode} />
          <Btn title="Verify OTP" onPress={verifyOtp} loading={loading} />
        </>
      )}

      {status && (
        <Text style={[s.msg, { color: status.ok ? 'green' : 'red' }]}>{status.text}</Text>
      )}
    </View>
  );
}

const Btn = ({ title, onPress, loading }) => (
  <TouchableOpacity style={s.btn} onPress={onPress} disabled={loading}>
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{title}</Text>}
  </TouchableOpacity>
);

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f7fb' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 32 },
  label: { fontSize: 16, marginBottom: 8, color: '#444' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccd', borderRadius: 10, padding: 14, fontSize: 18, marginBottom: 16 },
  btn: { backgroundColor: '#4f46e5', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  msg: { textAlign: 'center', marginTop: 20, fontSize: 16 },
});