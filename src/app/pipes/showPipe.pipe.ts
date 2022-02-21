import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
    name: 'showChar'
})
export class showCharPipe implements PipeTransform{

    transform(value:string): string {
        if(value.length > 30){
            return value.substring(0, 30) + '...';
        }else{
            return value;
        }


    }

}
