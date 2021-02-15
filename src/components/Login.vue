<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-form>
          <v-card class="elevation-12">
            <v-toolbar dark color="blue">
              <v-toolbar-title>
                Login
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-text-field
              prepend-icon="mdi-account"
              name="login"
              label="Login"
              v-model="username"
              type="text"
              >
              </v-text-field>
              <v-text-field
                prepend-icon="mdi-lock"
                name="password"
                label="Password"
                v-model="password"
                type="password"
                @keyup.enter="login"
              >
              </v-text-field>
            </v-card-text>
            <v-divider light></v-divider>
            <v-card-actions>
              <v-btn rounded >
                <router-link to="/sign-up">
                Sign Up
                </router-link>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="login" rounded dark>
                Login
                <v-icon>keyboard-arrow-right</v-icon>
              </v-btn>
              <v-btn rounded dark @click="socialLogin">
                Sign in with Google
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from 'firebase';
import 'firebase/auth';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    // eslint-disable-next-line
    async login() {
      // eslint-disable-next-line max-len,no-unused-vars
      // eslint-disable-next-line max-len,no-unused-vars
      await firebase.auth().signInWithEmailAndPassword(this.username.trim(), this.password).then((user) => {
        this.$router.push({ name: 'todos' });
      }).catch((err) => {
        alert(`Oops.${err.message}`);
      });
    },
    socialLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();

      // eslint-disable-next-line no-unused-vars
      firebase.auth().signInWithPopup(provider).then((result) => {
        this.$router.replace({ name: 'todos' });
      }).catch((err) => {
        alert(`Oops ${err.message}`);
      });
    },
  },
};
</script>

<style scoped></style>
