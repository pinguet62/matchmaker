import Vue from 'vue'
import Router from 'vue-router'
import Empty from '@/components/layout/Empty'
import EmptyRouterView from '@/components/layout/EmptyRouterView'
import Home from '@/components/Home'
import Admin from '@/components/admin/Admin'
import LinkSelection from '@/components/user/LinkSelection'
import Matchs from '@/components/user/Matchs'
import Match from '@/components/user/Match'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/admin',
      component: Admin
    },
    {
      path: '/user',
      component: EmptyRouterView,
      children: [
        {
          path: '',
          component: LinkSelection
        },
        {
          path: ':sharedLinkLink',
          name: 'Matchs',
          component: Matchs,
          children: [
            {
              path: '',
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
    }
  ]
})
