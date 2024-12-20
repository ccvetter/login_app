import React, { ReactElement } from "react";

export interface ColumnProps<T> {
    key: string;
    title: string | ReactElement;
    render?: (column: ColumnProps<T>, item: T) => ReactElement;
}
