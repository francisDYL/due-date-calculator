import {DueDateCalculator} from '../main/dueDateCalculator';


const calculator = new DueDateCalculator(9,17);

test('Should throw exception when submission time is invalid', () => {
    const call = () => { calculator.computeDueDate("2025-09-26T20:30:00",4); };
    expect(call).toThrow(Error);
});

test('Should throw exception when touraround time is invalid', () => {
    const call = () => { calculator.computeDueDate("2025-09-26T09:30:00",-2); };
    expect(call).toThrow(Error)
});

test('tournaround time is less than the remaining time in the day', () => {
    expect(calculator.computeDueDate('2025-09-26T10:30:00',4)).toEqual('2025-09-26T14:30:00');
});

test('tournaround time is greather than the remaining time in the day but still in working weeks', () => {
    expect(calculator.computeDueDate('2025-09-25T09:30:00',10)).toEqual('2025-09-26T11:30:00');
});

test('touraround time is exactly one days of work and is greather than remaining time in the days',  () => {
    expect(calculator.computeDueDate('2025-09-25T09:30:00',8)).toEqual('2025-09-26T09:30:00');
});

test('tournaround time is greather than the remaining time in the day and cross week-end', () => {
    expect(calculator.computeDueDate('2025-09-26T12:00:00',16)).toEqual('2025-09-30T12:00:00');
});

test('touraround time is more than 1 working weeks', () => {
    expect(calculator.computeDueDate('2025-09-26T09:00:00',55)).toEqual('2025-10-06T16:00:00');
});

test('tournaround time is less than an hour', () => {
    expect(calculator.computeDueDate('2025-09-25T09:30:00',0.5)).toEqual('2025-09-25T10:00:00');
});

test('tournaround time is more than an hour but not a full number of hours', ()=> {
    expect(calculator.computeDueDate('2025-09-25T09:30:00',2.5)).toEqual('2025-09-25T12:00:00');
});

test('turnaround greather than remaining hour in the days but less than a day of work', () => {
    expect(calculator.computeDueDate('2025-09-25T15:25:00',4.75)).toEqual('2025-09-26T12:10:00');
});