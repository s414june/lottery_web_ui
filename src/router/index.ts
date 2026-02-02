// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import { routes } from './routes'
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes as RouteRecordRaw[],
})

export default router
