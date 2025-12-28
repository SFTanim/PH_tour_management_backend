import { Query } from "mongoose";
export declare class QueryBuilder<T> {
    modelQuery: Query<T[], T>;
    readonly query: Record<string, string>;
    constructor(modelQuery: Query<T[], T>, query: Record<string, string>);
    filter(): this;
    search(searchableField: string[]): this;
    sort(): this;
    fields(): this;
    paginate(): this;
    build(): Query<T[], T, {}, unknown, "find", Record<string, never>>;
    getMeta(): Promise<{
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    }>;
}
//# sourceMappingURL=QueryBuilder.d.ts.map