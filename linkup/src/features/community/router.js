export const communityRoute= [

    {
        path: '/community',
        name: 'CommunityList',
        component: () => import('@/features/community/views/CommunityList.vue')
    },
    {
        path: '/community/:id',
        name: 'CommunityDetail',
        component: () => import('@/features/community/views/CommunityDetail.vue'),
        props: true,
    },
    {
        path: '/community/write',
        name: 'CommunityCreateView',
        component: () => import('@/features/community/views/CommunityCreateView.vue')
    },
    {
        path: '/community/:postId/edit',
        name: 'PostEdit',
        component: () => import('@/features/community/components/PostForm.vue'),
        props: true,
    }
]
