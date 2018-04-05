<template>
    <div>
        <v-form>
            <input
                    placeholder="Email"
                    v-model="email"
                    v-validate="'required|email'"
                    :class="{'input': true, 'is-danger': errors.has('email') }"
            />
        </v-form>
    </div>
</template>

<script>
  export default {
    data: () => ({
      email: ''
    })
  }
</script>
