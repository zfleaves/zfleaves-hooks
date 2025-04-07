export const menus = [
  {
    title: '生命周期',
    children: ['useMount', 'useUnmount', 'useUnmountedRef'],
  },
  {
    title: '状态',
    children: [
      'useBoolean',
      'useCookieState',
      'useDebounce',
      'useGetState',
      'useLocalStorageState',
      'useMap',
      'usePrevious',
      'useRafState',
      'useResetState',
      'useSafeState',
      'useSessionStorageState',
      'useSet',
      'useSetState',
      'useToggle',
      'useThrottle'
    ],
  },
  {
    title: 'Effect',
    children: ['useDebounceFn', 'useThrottleFn', 'useUpdateEffect'],
  },
  {
    title: 'DOM',
    children: [
      'useClickAway',
      'useDocumentVisibility',
      'useDrop',
      'useEventListener',
      'useEventTarget',
      'useFullscreen',
      'useHover',
      'useInViewport',
      'useLongPress',
      'useMouse',
    ],
  },
  {
    title: '进阶',
    children: [
      'useLatest',
      'useMemoizedFn'
    ],
  },
];
