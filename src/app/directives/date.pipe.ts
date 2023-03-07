import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'transDate'
})
export class datePipe implements PipeTransform {
    transform(date: any): any {
        let recievedDate:any = ((new Date().getTime() - new Date(date).getTime()) / 1000 / 60).toFixed()
        let dateMessage:string;
        if(recievedDate < 1){
            dateMessage = 'seconds ago'
        } else if(recievedDate >= 1 && recievedDate <= 59){
            dateMessage = `${recievedDate} minutes ago`
        } else if(recievedDate >= 60 && recievedDate <= 1439){
            dateMessage = `${(recievedDate / 60).toFixed()} hours ago`
        } else if(recievedDate >= 1440){
            dateMessage = `${(recievedDate / 1440).toFixed()} days ago`
        }
        return dateMessage
    }
}