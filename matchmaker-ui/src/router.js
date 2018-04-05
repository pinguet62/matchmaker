import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from '@/components/validation/Vuetify'
import VeeValidate from '@/components/validation/VeeValidate'
import Custom from '@/components/validation/Custom'
import Empty from '@/components/layout/Empty'
import EmptyRouterView from '@/components/layout/EmptyRouterView'
import Home from '@/components/Home'
import Admin from '@/components/admin/Admin'
import LinkSelection from '@/components/user/LinkSelection'
import Matches from '@/components/user/Matches'
import Match from '@/components/user/Match'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/validation',
      component: EmptyRouterView,
      children: [
        {
          path: '',
          component: Empty
        },
        {
          path: 'vuetify',
          component: Vuetify
        },
        {
          path: 'vee-validate',
          component: VeeValidate
        },
        {
          path: 'custom',
          component: Custom
        }
      ]
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
          name: 'Matches',
          component: Matches,
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
