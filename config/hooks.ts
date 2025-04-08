export const menus = [
  {
    title: 'LifeCycle',
    children: ['useMount', 'useUnmount', 'useUnmountedRef'],
  },
  {
    title: 'State',
    children: [
      'useSetState',
      'useBoolean',
      'useToggle',
      'useUrlState',
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
      'useEventListener',
      'useClickAway',
      'useDocumentVisibility',
      'useDrop',
      'useEventTarget',
      'useExternal',
      'useTitle',
      'useFavicon',
      'useFullscreen',
      'useHover',
      'useMutationObserver',
      'useInViewport',
      'useKeyPress',
      'useLongPress',
      'useMouse',
      'useResponsive',
      'useScroll',
      'useSize',
      'useFocusWithin',
    ],
  },
  {
    title: 'Advanced',
    children: [
      'useControllableValue',
      'useLatest',
      'useMemoizedFn'
    ],
  },
];
