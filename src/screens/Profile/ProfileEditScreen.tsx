import { useMutation } from '@apollo/client';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import { BugSnag } from '../../config/BugSnag';
import { useMe } from '../../hooks/useMe';
import {
  MeFieldsInterface,
  UPDATE_ME_MUTATION,
  UpdateMeMutationInterface,
  UpdateMeMutationVariables,
} from '../../queries/MeQueries';
import { ButtonStyles } from '../../styles/ButtonStyles';
import { BACKGROUND } from '../../styles/Colors';
import { ContainerStyles } from '../../styles/ContainerStyles';
import { TextStyles } from '../../styles/TextStyles';
import Collapsible from 'react-native-collapsible';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  toggleButton: {
    marginTop: 4,
    marginBottom: 4,
    width: '50%',
  },
});
const ProfileEditScreen: React.FC = () => {
  const { me } = useMe();
  const [state, setState] = useState(me),
    [processing, setProcessing] = useState(false),
    [collapsed, setCollapsed] = useState({ address: true, misc: true });

  const [updateMeMutation] = useMutation<
    UpdateMeMutationInterface,
    UpdateMeMutationVariables
  >(UPDATE_ME_MUTATION);

  function changeHandlerFactory(
    name: keyof MeFieldsInterface
  ): (text: string) => void {
    return (text: string): void => {
      setState({ ...state, [name]: text });
    };
  }

  async function handleSave() {
    setProcessing(true);
    try {
      await updateMeMutation({
        variables: state,
      });
    } catch (e) {
      BugSnag && BugSnag.notify(e);
      console.log(e);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <SafeAreaView
      style={[
        ContainerStyles.safeAreaViewContainer,
        { backgroundColor: BACKGROUND },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 85}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.container}
        >
          <View style={ContainerStyles.baseContainer}>
            <Input
              onChangeText={changeHandlerFactory('name')}
              value={state.name}
              label="Name"
              disabled={processing}
            />
            <TouchableOpacity
              style={[ButtonStyles.secondaryButton, styles.toggleButton]}
              onPress={() =>
                setCollapsed({ ...collapsed, address: !collapsed.address })
              }
            >
              <Text>Location Info</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed.address}>
              <Input
                onChangeText={changeHandlerFactory('city')}
                value={state.city}
                label="City"
                disabled={processing}
              />
              <Input
                onChangeText={changeHandlerFactory('state')}
                value={state.state}
                label="State"
                disabled={processing}
              />
              <Input
                onChangeText={changeHandlerFactory('postalCode')}
                value={state.postalCode}
                label="Postal Code"
                disabled={processing}
              />
              <Input
                onChangeText={changeHandlerFactory('country')}
                value={state.country}
                label="Country"
                disabled={processing}
              />
            </Collapsible>
            <TouchableOpacity
              style={[ButtonStyles.secondaryButton, styles.toggleButton]}
              onPress={() =>
                setCollapsed({ ...collapsed, misc: !collapsed.misc })
              }
            >
              <Text>Misc Info</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed.misc}>
              <Input
                onChangeText={changeHandlerFactory('language')}
                value={state.language}
                label="Language"
                disabled={processing}
              />
            </Collapsible>
            <TouchableOpacity
              style={[
                ButtonStyles.baseButton,
                processing ? ButtonStyles.disabledButton : {},
              ]}
              onPress={handleSave}
            >
              {processing ? (
                <Loading size={20} />
              ) : (
                <>
                  <MaterialIcons style={TextStyles.button} name="save" />
                  <Text style={TextStyles.button}> Save</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;
