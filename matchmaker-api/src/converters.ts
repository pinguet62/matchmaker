import {Proposition} from "./database/entities";
import {IProposition} from "./dto";

export function propositionToDto(entity: Proposition): IProposition {
    return {
        down: entity.down,
        id: entity.id!.toHexString(),
        message: entity.message,
        up: entity.up,
    };
}
