
import { ColumnDef as TanstackColumnDef } from '@tanstack/react-table';

export type EColumnDef<TData> = TanstackColumnDef<TData> & {
    enableEditing?: boolean;
}