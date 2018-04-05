<template>
    <div>
        <p>errors: {{ validator.errors.items }}</p>

        <v-form v-model="valid">
            <v-text-field
                    label="Name"
                    v-model="name"
                    required
                    :rules="errors.name"
                    :counter="10"
            />
            <v-text-field
                    label="E-mail"
                    v-model="email"
                    :rules="getErrors().email"
            />
        </v-form>
    </div>
</template>

<script>
  import { Validator } from 'vee-validate'

  export default {
    created () {
      this.validator = new Validator(this.validationRules)
      this.validator.validate('email', 'foo@bar.org')
        .then(result => {
          console.log('>> result', result)
          console.log('>> errors', this.validator.errors)
        })
        .catch((err) => {
          console.log('>> err', err)
          console.log('>> errors', this.validator.errors)
        })
    },
    data: () => ({
      valid: false,
      name: '',
      email: '',
      validationRules: {
        name: 'required|alpha|min:3',
        email: 'required|email|min:3'
      }
    }),
    methods: {
      async getErrors () {
        let errors = {}
        Object.entries(this.validationRules).forEach(([key, rules]) => {
          /*await*/
          this.validator.validate(key, this[key])
            .then((x) => console.log(x))
            .catch((e) => console.log(e))
        })
        return errors
      }
    },
    computed: {
      errors () {
        console.log('[computed] errors')
        return this.getErrors()
      }
    }
  }
</script>
