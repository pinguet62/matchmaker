import {validate} from "class-validator";
import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from "typeorm";
import {ValidationError} from "../exceptions";

@EventSubscriber()
export class AllSubscriber implements EntitySubscriberInterface {

    public async beforeInsert(event: InsertEvent<any>) {
        await this.validate(event.entity);
    }

    public async beforeUpdate(event: UpdateEvent<any>) {
        await this.validate(event.entity);
    }

    private async validate(entity: any) {
        const errors = await validate(entity);
        if (errors.length > 0) {
            throw new ValidationError();
        }
    }

}
