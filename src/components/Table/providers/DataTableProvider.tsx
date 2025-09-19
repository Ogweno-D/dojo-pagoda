import React, {useState, createContext, type ReactNode, useContext, useEffect, useRef} from "react";
import type {FilterRule, SortRule} from "../ReusableTable/TableActions/types.ts";

interface DataTableContextType<T>{
    originalData: T[];
    filteredAndSortedData: T[];

    sorts: SortRule[];
    filters: FilterRule[];
    page: number;
    pageSize: number;

    setSorts: React.Dispatch<React.SetStateAction<SortRule[]>>;
    setFilters: React.Dispatch<React.SetStateAction<FilterRule[]>>;
    setPage:React.Dispatch<React.SetStateAction<number>>;
    setPageSize:React.Dispatch<React.SetStateAction<number>>;

    applyRules:() => void;
    resetRules:() => void;
}
const DataTableContext = createContext<DataTableContextType<any> | undefined>(undefined);
export const useDataTable = <T,>() => {
    const context = useContext(DataTableContext);
    if (!context) {
        throw new Error("useDataTable must be used within a Datatable provider");
    }
    return context as DataTableContextType<T>
}

interface DataTableProviderProps <T>{
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

export const DataTableProvider =<T extends Record<string , any>>({
                                                                     children,
                                                                     data,
                                                                     storageKey = "table-state",
                                                                     onApply,
                                                                     initialState = {}
                                                                 }: DataTableProviderProps<T>) => {

    const [sorts, setSorts] = useState<SortRule[]>(initialState.sorts || []);
    const [filters, setFilters] = useState<FilterRule[]>(initialState.filters || []);
    const[page, setPage] = useState<number>(initialState.page || 1);
    const [pageSize,setPageSize] = useState<number>(initialState?.pageSize || 5);
    
    const [filteredAndSortedData, setFilteredAndSortedData] = useState<T[]>(data);

    const isInitialMount = useRef(true);

    //For the filter and sort
    useEffect(() => {
        let result =[...data];

        //Apply filters
        if(filters.length > 0){
            result = result.filter((row) =>
                filters.every((f) =>{
                    if(!f.value) return true;
                    const fieldVal = String(row[f.field as keyof T] ?? "").toLowerCase()
                    const val = f.value.toLowerCase();
                    switch(f.operator){
                        case "contains": return  fieldVal.includes(val);
                        case "equals": return fieldVal  === val;
                        case "startsWith" : return  fieldVal.startsWith(val);
                        case "endsWith": return  fieldVal.endsWith(val);
                        default: return  true;
                    }
                })
            );
        }

        //Apply Sorts
        if(sorts.length> 0){
            sorts.forEach((rule) => {
                result.sort((a,b)=>{
                    const v1 = String(a[rule.field as keyof T] ?? "").toLowerCase();
                    const v2 = String(b[rule.field as keyof T] ?? "").toLowerCase();
                    return rule.order === "asc" ? v1.localeCompare(v2) : v2.localeCompare(v1);
                });
            });
        }
        
        const start = (page-1) * pageSize;
        const end = start + pageSize;
        const paginatedResult = result.slice(start,end)

        setFilteredAndSortedData(paginatedResult);
        onApply?.(paginatedResult);

        if (!isInitialMount.current) {
            sessionStorage.setItem(storageKey, JSON.stringify({ sorts, filters }));
        }
        isInitialMount.current = false;

    },[data, sorts, filters, onApply, storageKey, page, pageSize]);


    const applyRules =() =>{
        sessionStorage.setItem(storageKey, JSON.stringify({sorts, filters, page, pageSize}));
    }

    const resetRules =()=>{
        setPageSize(1)
        setFilters([]);
        setSorts([]);
        sessionStorage.removeItem(storageKey)
    }

    const value ={
        originalData: data,
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
    }

    return <DataTableContext.Provider value={value}> {children} </DataTableContext.Provider>
}