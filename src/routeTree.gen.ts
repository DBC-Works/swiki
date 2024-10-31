/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as PagesIndexImport } from './routes/pages/index'
import { Route as HistoryIndexImport } from './routes/history/index'
import { Route as PagesPageTitleIndexImport } from './routes/pages/$pageTitle/index'
import { Route as PagesPageTitleEditImport } from './routes/pages/$pageTitle/edit'
import { Route as PagesPageTitleDiffIndexImport } from './routes/pages/$pageTitle/diff/index'
import { Route as PagesPageTitleDiffNumberImport } from './routes/pages/$pageTitle/diff/$number'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PagesIndexRoute = PagesIndexImport.update({
  id: '/pages/',
  path: '/pages/',
  getParentRoute: () => rootRoute,
} as any)

const HistoryIndexRoute = HistoryIndexImport.update({
  id: '/history/',
  path: '/history/',
  getParentRoute: () => rootRoute,
} as any)

const PagesPageTitleIndexRoute = PagesPageTitleIndexImport.update({
  id: '/pages/$pageTitle/',
  path: '/pages/$pageTitle/',
  getParentRoute: () => rootRoute,
} as any)

const PagesPageTitleEditRoute = PagesPageTitleEditImport.update({
  id: '/pages/$pageTitle/edit',
  path: '/pages/$pageTitle/edit',
  getParentRoute: () => rootRoute,
} as any)

const PagesPageTitleDiffIndexRoute = PagesPageTitleDiffIndexImport.update({
  id: '/pages/$pageTitle/diff/',
  path: '/pages/$pageTitle/diff/',
  getParentRoute: () => rootRoute,
} as any)

const PagesPageTitleDiffNumberRoute = PagesPageTitleDiffNumberImport.update({
  id: '/pages/$pageTitle/diff/$number',
  path: '/pages/$pageTitle/diff/$number',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/history/': {
      id: '/history/'
      path: '/history'
      fullPath: '/history'
      preLoaderRoute: typeof HistoryIndexImport
      parentRoute: typeof rootRoute
    }
    '/pages/': {
      id: '/pages/'
      path: '/pages'
      fullPath: '/pages'
      preLoaderRoute: typeof PagesIndexImport
      parentRoute: typeof rootRoute
    }
    '/pages/$pageTitle/edit': {
      id: '/pages/$pageTitle/edit'
      path: '/pages/$pageTitle/edit'
      fullPath: '/pages/$pageTitle/edit'
      preLoaderRoute: typeof PagesPageTitleEditImport
      parentRoute: typeof rootRoute
    }
    '/pages/$pageTitle/': {
      id: '/pages/$pageTitle/'
      path: '/pages/$pageTitle'
      fullPath: '/pages/$pageTitle'
      preLoaderRoute: typeof PagesPageTitleIndexImport
      parentRoute: typeof rootRoute
    }
    '/pages/$pageTitle/diff/$number': {
      id: '/pages/$pageTitle/diff/$number'
      path: '/pages/$pageTitle/diff/$number'
      fullPath: '/pages/$pageTitle/diff/$number'
      preLoaderRoute: typeof PagesPageTitleDiffNumberImport
      parentRoute: typeof rootRoute
    }
    '/pages/$pageTitle/diff/': {
      id: '/pages/$pageTitle/diff/'
      path: '/pages/$pageTitle/diff'
      fullPath: '/pages/$pageTitle/diff'
      preLoaderRoute: typeof PagesPageTitleDiffIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/history': typeof HistoryIndexRoute
  '/pages': typeof PagesIndexRoute
  '/pages/$pageTitle/edit': typeof PagesPageTitleEditRoute
  '/pages/$pageTitle': typeof PagesPageTitleIndexRoute
  '/pages/$pageTitle/diff/$number': typeof PagesPageTitleDiffNumberRoute
  '/pages/$pageTitle/diff': typeof PagesPageTitleDiffIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/history': typeof HistoryIndexRoute
  '/pages': typeof PagesIndexRoute
  '/pages/$pageTitle/edit': typeof PagesPageTitleEditRoute
  '/pages/$pageTitle': typeof PagesPageTitleIndexRoute
  '/pages/$pageTitle/diff/$number': typeof PagesPageTitleDiffNumberRoute
  '/pages/$pageTitle/diff': typeof PagesPageTitleDiffIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/history/': typeof HistoryIndexRoute
  '/pages/': typeof PagesIndexRoute
  '/pages/$pageTitle/edit': typeof PagesPageTitleEditRoute
  '/pages/$pageTitle/': typeof PagesPageTitleIndexRoute
  '/pages/$pageTitle/diff/$number': typeof PagesPageTitleDiffNumberRoute
  '/pages/$pageTitle/diff/': typeof PagesPageTitleDiffIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/history'
    | '/pages'
    | '/pages/$pageTitle/edit'
    | '/pages/$pageTitle'
    | '/pages/$pageTitle/diff/$number'
    | '/pages/$pageTitle/diff'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/history'
    | '/pages'
    | '/pages/$pageTitle/edit'
    | '/pages/$pageTitle'
    | '/pages/$pageTitle/diff/$number'
    | '/pages/$pageTitle/diff'
  id:
    | '__root__'
    | '/'
    | '/history/'
    | '/pages/'
    | '/pages/$pageTitle/edit'
    | '/pages/$pageTitle/'
    | '/pages/$pageTitle/diff/$number'
    | '/pages/$pageTitle/diff/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  HistoryIndexRoute: typeof HistoryIndexRoute
  PagesIndexRoute: typeof PagesIndexRoute
  PagesPageTitleEditRoute: typeof PagesPageTitleEditRoute
  PagesPageTitleIndexRoute: typeof PagesPageTitleIndexRoute
  PagesPageTitleDiffNumberRoute: typeof PagesPageTitleDiffNumberRoute
  PagesPageTitleDiffIndexRoute: typeof PagesPageTitleDiffIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  HistoryIndexRoute: HistoryIndexRoute,
  PagesIndexRoute: PagesIndexRoute,
  PagesPageTitleEditRoute: PagesPageTitleEditRoute,
  PagesPageTitleIndexRoute: PagesPageTitleIndexRoute,
  PagesPageTitleDiffNumberRoute: PagesPageTitleDiffNumberRoute,
  PagesPageTitleDiffIndexRoute: PagesPageTitleDiffIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/history/",
        "/pages/",
        "/pages/$pageTitle/edit",
        "/pages/$pageTitle/",
        "/pages/$pageTitle/diff/$number",
        "/pages/$pageTitle/diff/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/history/": {
      "filePath": "history/index.tsx"
    },
    "/pages/": {
      "filePath": "pages/index.tsx"
    },
    "/pages/$pageTitle/edit": {
      "filePath": "pages/$pageTitle/edit.tsx"
    },
    "/pages/$pageTitle/": {
      "filePath": "pages/$pageTitle/index.tsx"
    },
    "/pages/$pageTitle/diff/$number": {
      "filePath": "pages/$pageTitle/diff/$number.tsx"
    },
    "/pages/$pageTitle/diff/": {
      "filePath": "pages/$pageTitle/diff/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
