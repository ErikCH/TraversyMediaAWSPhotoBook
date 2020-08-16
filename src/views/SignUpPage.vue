<template>
  <div>
    <form v-if="!confirmPassword" class="flex flex-col items-center" @submit.prevent="signUp">
      <div class="flex flex-col user">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="userName">User Name</label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          v-model="username"
          id="userName"
        />
      </div>
      <div class="flex flex-col mt-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          id="password"
          v-model="password"
        />
      </div>
      <div class="flex flex-col mt-2">
        <label class="block text-gray-700 text-sm font-bold" for="email">Email</label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
          id="email"
          v-model="email"
        />
      </div>
      <!-- eslint-disable -->
      <button class="btn-blue">Sign Up</button>
    </form>
    <div v-if="error" class="text-red-600">{{ error.message }}</div>
    <div v-if="confirmPassword" class="w-4/12 m-auto">
      <h3>Enter your code. Please check your email</h3>
      <div class="flex flex-col mt-2">
        <label class="block text-gray-700 text-sm font-bold" for="password">Code</label>
        <input
          class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          v-model="code"
        />
        <button class="btn-blue" @click="confirmSignUp">Confirm Code</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    username: "",
    password: "",
    email: "",
    error: "",
    confirmPassword: false,
    code: "",
  }),
  methods: {
    async signUp() {
      if (!this.email || !this.password) {
        return;
      }
      try {
        await this.$store.dispatch("auth/signUp", {
          username: this.username,
          password: this.password,
          email: this.email,
        });

        this.confirmPassword = true;
      } catch (error) {
        this.error = error;
      }
    },
    async confirmSignUp() {
      if (!this.username || !this.code) {
        return;
      }

      try {
        const { username, password, code } = this;
        await this.$store.dispatch("auth/confirmSignUp", {
          username,
          code,
        });
        await this.$store.dispatch("auth/login", {
          username,
          password,
        });
        this.$router.push("/albums");
      } catch (error) {
        console.log(error);
        this.error = error;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>