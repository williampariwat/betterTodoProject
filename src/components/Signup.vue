<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="blue">
            <v-toolbar-title>
              Sign Up
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>

              <v-text-field
                prepend-icon="mdi-email"
                name="email"
                label="Email"
                v-model="email"
                :rules="[rules.required,rules.email]"
              >
              </v-text-field>
              <v-text-field
                prepend-icon="mdi-lock"
                name="password"
                label="Password"
                v-model="password"
                :rules="[rules.required]"
                type="password"
              >
              </v-text-field>
              <v-text-field
                prepend-icon="mdi-lock"
                name="password"
                label="Confirm Password"
                type="password"
                :rules="[comparePass]"
                v-model="confirmPass"
              >
              </v-text-field>

            </v-form>
          </v-card-text>
          <v-divider light></v-divider>
          <v-card-actions>
            <v-btn to="/login" rounded color="black" dark>Back to Login</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success"
                   rounded dark
                   @click.prevent="signUp"
                   :disabled="isValid">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Signup',
  data: () => ({
    email: '',
    password: '',
    confirmPass: '',
    rules: {
      required: (value) => !!value || 'Required',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      },
    },
  }),
  methods: {
    signUp() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        // eslint-disable-next-line no-unused-vars
        (user) => {
          alert('Your account has been created!');
        },
        (err) => {
          alert(`Oops. ${err.message}`);
        },
      );
    },
  },
  computed: {
    comparePass() {
      return this.password !== this.confirmPass ? 'Password does not match' : true;
    },
    isValid() {
      return this.password !== this.confirmPass;
    },
  },
};
</script>

<style scoped>

</style>
