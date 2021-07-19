import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PaginatedResult } from './paginated-result.interface';

@Injectable()
export abstract class AbstractService {
    protected constructor(
        protected readonly model: Model<any>
    ){}

    
    async all(): Promise<any[]> {
        return this.model.find().exec();
    }

    async paginate(
        page: number = 1,
        pageSizes = 10,
        sort: any = {},
        query: any = {}
    ): Promise<PaginatedResult> {
        const { q, inputs } = query;
        const regex = new RegExp(q, 'i');
        const or = await inputs.map(input => {
            let obj = {};
            obj[input] = regex;
            return obj;
        })
        const [data, total] = await Promise.all([
            this.model.find({})
                .or(or)
                .skip((Number(page) - 1) * Number(pageSizes))
                .limit(Number(pageSizes))
                .sort(sort),
            this.model.countDocuments({})
                          .or(or)
        ]);

        return {
            data,
            meta: {
                total,
                page: Number(page),
                pageSizes: Number(pageSizes),
                lastPage: Math.ceil(total / pageSizes)
            }
        }
    }

    async findOne(condition = {}): Promise<any> {
        return this.model.findOne(condition).exec();
    }

    async findById(id): Promise<any> {
        return this.model.findById(id).exec();
    }

    async create(data): Promise<any> {
        const createdUser = new this.model(data);
        return createdUser.save();
    }

    async update(id: string, data): Promise<any> {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<any> {
        return this.model.findByIdAndRemove(id);
    }
    
}
