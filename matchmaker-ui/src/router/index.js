import Vue from 'vue'
import Router from 'vue-router'
import Admin from '@/components/admin/Admin'
import Empty from '@/components/Empty'
import Matchs from '@/components/Matchs'
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
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/user',
      name: 'Matchs',
      component: Matchs,
      children: [
        {
          path: '',
          name: 'Empty',
          component: Empty
        },
        {
          path: ':matchId',
          name: 'Match',
          component: Match
        }
      ]
    }
  ]
})
