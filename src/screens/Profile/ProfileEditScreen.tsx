import { useMutation } from '@apollo/client';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PolyfillBlob } from 'rn-fetch-blob';
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

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});
const ProfileEditScreen: React.FC = () => {
  const { me } = useMe();
  const [state, setState] = useState(me),
    [processing, setProcessing] = useState(false);
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
          <Input
            onChangeText={changeHandlerFactory('language')}
            value={state.language}
            label="Language"
            disabled={processing}
          />

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
    </SafeAreaView>
  );
};

export default ProfileEditScreen;
