import Vue from 'vue'
import Router from 'vue-router'
import Admin from '@/components/admin/Admin'
import Empty from '@/components/Empty'
import EmptyRouterView from '@/components/EmptyRouterView'
import LinkSelection from '@/components/LinkSelection'
import Matchs from '@/components/Matchs'
import Match from '@/components/Match'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Empty
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
