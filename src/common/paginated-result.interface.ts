export class PaginatedResult {
    data: any[];
    meta: { 
        total: number, 
        page: number,
        pageSizes: number,
        lastPage: number
    }
}