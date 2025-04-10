import type { PaginationOptions, PaginationResult } from '../usePagination/types';

export type Data = { total: number; list: any[] };  // 数据格式，包含总数和列表
export type Params = [  // 请求参数格式
    {
        current: number;  // 当前页码
        pageSize: number; // 每页数量
        sorter?: any;     // 排序信息
        filters?: any;    // 过滤信息
        extra?: any;      // 额外参数
        [key: string]: any; // 其他任意参数
    },
    ...any[],  // 其他任意参数
];

export type Service<TData extends Data, TParams extends Params> = (
    ...args: TParams
) => Promise<TData>;

export type Antd3ValidateFields = (
    fieldNames: string[],
    callback: (errors, values: Record<string, any>) => void,
) => void;

export type Antd4ValidateFields = (fieldNames?: string[]) => Promise<Record<string, any>>;

export interface AntdFormUtils {
    getFieldInstance?: (name: string) => Record<string, any>;
    setFieldsValue: (value: Record<string, any>) => void;
    getFieldsValue: (...args: any) => Record<string, any>;
    resetFields: (...args: any) => void;
    validateFields: Antd3ValidateFields | Antd4ValidateFields;
    getInternalHooks?: any;
    [key: string]: any;
}

export interface AntdTableResult<TData extends Data, TParams extends Params>
    extends PaginationResult<TData, TParams> {
    tableProps: {  // 表格属性
        dataSource: TData['list'];  // 数据源
        loading: boolean;           // 加载状态
        onChange: (pagination: any, filters?: any, sorter?: any) => void; // 变化回调
        pagination: any;           // 分页信息
        [key: string]: any;
    };
    search: {  // 搜索相关
        type: 'simple' | 'advance';  // 搜索类型
        changeType: () => void;      // 切换搜索类型
        submit: () => void;          // 提交搜索
        reset: () => void;           // 重置搜索
    };
}

export interface AntdTableOptions<TData extends Data, TParams extends Params>
  extends PaginationOptions<TData, TParams> {
  form?: AntdFormUtils;  // 表单工具
  defaultType?: 'simple' | 'advance';  // 默认搜索类型
}