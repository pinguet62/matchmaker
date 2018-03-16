<template>
  <div>
    <v-carousel>
      <v-carousel-item v-for="photo in value.photos" :key="photo" v-bind:src="photo"/>
    </v-carousel>
    <v-container fluid>
      <h2>{{value.name}}</h2>
      <v-divider/>
      <div>
        <div>
          <v-icon>timelapse</v-icon>
          <span>{{value.age}} ans</span>
        </div>
        <template v-for="job in value.jobs">
          <div :key="job">
            <v-icon>card_travel</v-icon>
            <span>{{job}}</span>
          </div>
        </template>
        <div v-for="school in value.schools" :key="school">
          <v-icon>school</v-icon>
          <span>{{school}}</span>
        </div>
        <div>
          <v-icon>room</v-icon>
          <span>{{'à ' + value.distance + ' km de distance'}}</span>
        </div>
      </div>
      <v-divider/>
      <div v-if="value.description">
        <span>{{value.description}}</span>
      </div>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'Profile',
    props: ['value']
  }
</script>
