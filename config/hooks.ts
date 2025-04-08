export const menus = [
  {
    title: '生命周期',
    children: ['useMount', 'useUnmount', 'useUnmountedRef'],
  },
  {
    title: '状态',
    children: [
      'useSetState',
      'useBoolean',
      'useToggle',
      'useCookieState',
      'useLocalStorageState',
      'useSessionStorageState',
      'useDebounce',
      'useThrottle',
      'useMap',
      'useSet',
      'usePrevious',
      'useRafState',
      'useSafeState',
      'useGetState',
      'useResetState',
    ],
  },
  {
    title: 'Effect',
    children: [
      'useDebounceFn', 
      'useThrottleFn', 
      'useUpdateEffect',
      'useUpdate'
    ],
  },
  {
    title: 'DOM',
    children: [
      'useClickAway',
      'useDocumentVisibility',
      'useDrop',
      'useEventListener',
      'useEventTarget',
      'useExternal',
      'useFavicon',
      'useFullscreen',
      'useHover',
      'useInViewport',
      'useLongPress',
      'useMouse',
      'useKeyPress',
      'useMutationObserver',
      'useResponsive',
      'useScroll',
      'useSize',
      'useTitle',
      'useFocusWithin',
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
