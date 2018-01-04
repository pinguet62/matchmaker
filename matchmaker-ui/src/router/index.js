import Vue from 'vue'
import Router from 'vue-router'
import Empty from '@/components/Empty'
import Match from '@/components/Match'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Empty',
      component: Empty
    },
    {
      path: '/:matchId',
      name: 'Match',
      component: Match
    }
  ]
})
