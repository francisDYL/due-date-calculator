import {DueDateCalculator} from '../main/dueDateCalculator';

test('dump test that do nothing', () => {
    const calculator = new DueDateCalculator(9,17);
    expect(calculator).toBeDefined()
});