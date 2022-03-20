export declare function isNil<T>(v: Nilable<T>): v is Nil;
export declare type Nullable<T> = T | null;
export declare type Nilable<T> = T | Nil;
export declare type Nil = null | undefined;
export declare function isBool(v: unknown): v is boolean;
export declare function isStr(v: unknown): v is string;
export declare function intoArr<T>(v: T | T[]): T[];
