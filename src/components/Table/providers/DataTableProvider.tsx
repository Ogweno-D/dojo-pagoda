import React, {
    useState,
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useRef,
} from "react";
import type { FilterRule, SortRule } from "../ReusableTable/TableActions/types.ts";

interface DataTableContextType<T extends object> {
    originalData: T[];
    filteredAndSortedData: T[];

    sorts: SortRule[];
    filters: FilterRule[];
    page: number;
    pageSize: number;

    setSorts: React.Dispatch<React.SetStateAction<SortRule[]>>;
    setFilters: React.Dispatch<React.SetStateAction<FilterRule[]>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;

    // New
    setData: React.Dispatch<React.SetStateAction<T[]>>;

    applyRules: () => void;
    resetRules: () => void;
}

const DataTableContext = createContext<DataTableContextType<any> | undefined>(
    undefined
);

export const useDataTable = <T extends object>() => {
    const context = useContext(DataTableContext);
    if (!context) {
        throw new Error("useDataTable must be used within a DataTableProvider");
    }
    return context as DataTableContextType<T>;
};

interface DataTableProviderProps<T> {
    children: ReactNode;
    data: T[];
    storageKey?: string;
    onApply?: (filteredAndSortedData: T[]) => void;
    initialState?: {
        sorts?: SortRule[];
        filters?: FilterRule[];
        page?: number;
        pageSize?: number;
    };
}

export const DataTableProvider = <T extends Record<string, any>>({
                                                                     children,
                                                                     data,
                                                                     storageKey = "table-state",
                                                                     onApply,
                                                                     initialState = {},
                                                                 }: DataTableProviderProps<T>) => {
    const [originalData, setOriginalData] = useState<T[]>(data);
    const [filteredAndSortedData, setFilteredAndSortedData] = useState<T[]>([]);

    const [sorts, setSorts] = useState<SortRule[]>(initialState.sorts || []);
    const [filters, setFilters] = useState<FilterRule[]>(initialState.filters || []);
    const [page, setPage] = useState<number>(initialState.page || 1);
    const [pageSize, setPageSize] = useState<number>(initialState?.pageSize || 5);

    const isInitialMount = useRef(true);

    // Keep provider's data in sync with prop
    useEffect(() => {
        setOriginalData(data);
    }, [data]);

    // Filter, sort, paginate
    useEffect(() => {
        let result = [...originalData];

        // Filters
        if (filters.length > 0) {
            result = result.filter((row) =>
                filters.every((f) => {
                    if (!f.value) return true;
                    const fieldVal = String(row[f.field as keyof T] ?? "").toLowerCase();
                    const val = f.value.toLowerCase();
                    switch (f.operator) {
                        case "contains":
                            return fieldVal.includes(val);
                        case "equals":
                            return fieldVal === val;
                        case "startsWith":
                            return fieldVal.startsWith(val);
                        case "endsWith":
                            return fieldVal.endsWith(val);
                        default:
                            return true;
                    }
                })
            );
        }

        // Sorts
        if (sorts.length > 0) {
            sorts.forEach((rule) => {
                result.sort((a, b) => {
                    const v1 = String(a[rule.field as keyof T] ?? "").toLowerCase();
                    const v2 = String(b[rule.field as keyof T] ?? "").toLowerCase();
                    return rule.order === "asc"
                        ? v1.localeCompare(v2)
                        : v2.localeCompare(v1);
                });
            });
        }


        setFilteredAndSortedData(result);
        onApply?.(result);

        if (!isInitialMount.current) {
            sessionStorage.setItem(
                storageKey,
                JSON.stringify({ sorts, filters, page, pageSize })
            );
        }
        isInitialMount.current = false;
    }, [originalData, sorts, filters, page, pageSize, onApply, storageKey]);

    const applyRules = () => {
        sessionStorage.setItem(
            storageKey,
            JSON.stringify({ sorts, filters, page, pageSize })
        );
    };

    const resetRules = () => {
        setPage(1);
        setFilters([]);
        setSorts([]);
        sessionStorage.removeItem(storageKey);
    };

    const value: DataTableContextType<T> = {
        originalData,
        filteredAndSortedData,
        sorts,
        setSorts,
        filters,
        setFilters,
        applyRules,
        resetRules,
        page,
        setPage,
        pageSize,
        setPageSize,
        setData: setOriginalData,
    };

    return (
        <DataTableContext.Provider value={value}>
            {children}
        </DataTableContext.Provider>
    );
};
