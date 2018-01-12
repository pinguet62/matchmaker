<template>
  <div>
    <section class="title">
      <v-layout>
        <v-flex xs4>
          <img src="../assets/logo.png" class="logo">
        </v-flex>
        <v-flex lg8>
          <v-layout column>
            <v-flex>
              <h1>MatchMaker</h1>
            </v-flex>
            <v-flex>
              <h2>Mutual support platform for dating site.</h2>
            </v-flex>
            <v-flex>
              <v-layout wrap justify-center>
                <v-flex lg4>
                  <v-btn block large color="error" to="/admin">
                    <v-icon left>hearing</v-icon>
                    I whant help...
                  </v-btn>
                </v-flex>
                <v-flex lg4>
                  <v-btn block large color="success" to="/user">
                    I want help a friend!
                    <v-icon right>record_voice_over</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </section>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>
  .logo {
    max-width: 100%;
    max-height: 100%;
  }
</style>
