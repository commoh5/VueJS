<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      {{ error }}</base-dialog
    >
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <p>Authenticating...</p>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="email">Email</label>
          <input id="email" type="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input id="password" type="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsvalid">
          Please enter a valid email and password (password more than 6
          charater)
        </p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchAuthMode">{{
          switchModeButtonCaption
        }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      formIsvalid: true,
      mode: 'login',
      isLoading: false,
      error: '',
    };
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'login') {
        return 'login';
      } else {
        return 'signup';
      }
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') {
        return 'signup instead';
      } else {
        return 'login instead';
      }
    },
  },
  methods: {
    async submitForm() {
      this.formIsvalid = true;
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.password.length < 6
      ) {
        this.formIsvalid = false;
        return;
      }
      this.isLoading = true;
      const actionPayload = { email: this.email, password: this.password };
      try {
        if (this.mode === 'login') {
          //Login
          await this.$store.dispatch('login', actionPayload);
        } else {
          //Signup
          await this.$store.dispatch('signup', actionPayload);
        }
        const redirectUrl = '/' + (this.$route.query.redirectUrl || 'coaches');
        this.$router.replace(redirectUrl);
      } catch (err) {
        this.error = err.message || 'Failed to authenticate, try later.';
      }
      this.isLoading = false;
    },
    switchAuthMode() {
      if (this.mode === 'login') {
        this.mode = 'sigup';
      } else {
        this.mode = 'login';
      }
    },
    handleError() {
      this.error = '';
    },
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>