import { useEffect, useRef, useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import usePagination from '../usePagination';
import useUpdateEffect from '../useUpdateEffect';

import type {
    Antd4ValidateFields,
    AntdTableOptions,
    Data,
    Params,
    Service,
    AntdTableResult,
} from './types';

const useAntdTable = <TData extends Data, TParams extends Params>(
    service: Service<TData, TParams>,
    options: AntdTableOptions<TData, TParams> = {},
) => {

}