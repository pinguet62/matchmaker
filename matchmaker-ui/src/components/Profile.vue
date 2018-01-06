<template>
  <div class="profile">
    <v-carousel>
      <v-carousel-item v-for="photo in value.photos" :key="photo.id" v-bind:src="photo.url" cycle="false"></v-carousel-item>
    </v-carousel>
    <h2>{{value.name}}</h2>
    <div>
      <v-icon>timelapse</v-icon>
      <span>{{value.birth_date | parseIso8601 | age}} ans</span>
    </div>
    <template v-for="job in value.jobs">
      <div>
        <v-icon>card_travel</v-icon>
        <span>{{formatJob(job)}}</span>
      </div>
    </template>
    <div v-for="school in value.schools">
      <v-icon>school</v-icon>
      <span>{{school.name}}</span>
    </div>
    <div>
      <v-icon>room</v-icon>
      <span>{{'à ' + value.distance_mi + ' km de distance'}}</span>
    </div>
    <div v-if="value.bio">
      <span>{{value.bio}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Profile',
    props: ['value'],
    methods: {
      formatJob (jobs) {
        if (jobs.title && jobs.company) return `${jobs.title.name} chez ${jobs.company.name}`
        else if (jobs.title) return jobs.title.name
        else if (jobs.company) return jobs.company.name
        else return null
      }
    }
  }
</script>

<style scoped>
  .profile {

  }
</style>
