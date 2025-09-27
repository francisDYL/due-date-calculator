/**
 * Calculator that compute due date of an issue on submission date and turnaround time
 * Week-end are not working days and we do not consider holidays for computation
 * We assume that submission date is already in a valid format
 */
export class DueDateCalculator {

    private dayStart: number;
    private dayEnd: number;
    private shiftLength: number;

    /**
     * take in parameter working hour start and end in the 24H format
    */
    constructor(_dayStart: number, _dayEnd: number) {
        this.dayStart = _dayStart;
        this.dayEnd = _dayEnd;
        this.shiftLength = _dayEnd - _dayStart;
    }

    computeDueDate(submisionDate: string, tournaround: number): string {

        // validate that date and touraround are valid input
        const date: Date = new Date(submisionDate);
        const dayOfWeek = date.getDay();
        const submissionHour = date.getHours();

        if(!this.isValidSubmissionDate(dayOfWeek,submissionHour)) throw new Error(`Submission date can only be on a working day and between wworking hours`);

        if(tournaround <= 0) throw new Error (`Turnaround time can't be negative or null`);

        // compute due date
        while (tournaround > 0) {

            // get remaining work time in hour
            const remaining = (this.dayEnd - date.getHours()) - date.getMinutes()/60;

            //if remaining time is enough
            if(remaining > tournaround) {
                date.setTime(date.getTime() + tournaround * 3600000);
                tournaround = 0;
            } else {
            //verify is touraround time is more than a working day, then move day by day at the same time    
                const days = Math.floor(tournaround / this.shiftLength);
                if (days > 0) {
                    for(let i =0; i < days; i++) {
                      this.addOneDayOnDate(date);
                    }
                    tournaround -= days * this.shiftLength;
                } else { // touraround time is less that a working day, then move to the next working day at 9 AM
                    this.addOneDayOnDate(date);
                    date.setHours(this.dayStart,0,0,0);
                    tournaround -= remaining;
                }
                
            }
        }

        //return the value
        return this.formatDateTime(date);

    }

    //help validating that the submission date is correct
    private isValidSubmissionDate(day: number, hour: number): boolean {
        if( day === 0 || day === 6 || !(this.dayStart <= hour && hour < this.dayEnd)) 
            return false;
        return true;
    }

    /**
     * format date to string
     * @param date 
     * @returns 
     */
    private formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    /**
     * add one day on a date, and if the next is week-end then continue untill start of the week
     * @param date 
     */
    private addOneDayOnDate(date: Date) {
        date.setDate(date.getDate() + 1);
        if(date.getDay() == 0) {
            date.setDate(date.getDate() + 1);
        } else if(date.getDay() == 6) {
            date.setDate(date.getDate() + 2);
        }
    }
}