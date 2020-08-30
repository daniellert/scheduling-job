import JobsService from './JobsService';
import api from './api';
jest.mock('./api');

const defaultData = {
    data: [
        { id: 1, description: '1', maxExecutionDate: "2019-11-10 12:00:00", estimatedTime: 2 },
        { id: 2, description: '2', maxExecutionDate: "2019-11-11 12:00:00", estimatedTime: 4 },
        { id: 3, description: '3', maxExecutionDate: "2019-11-11 08:00:00", estimatedTime: 6 }
    ]
};

describe('Jobs Service', () => {

    it('should get all jobs', async () => {
        api.get.mockImplementation(() => Promise.resolve(defaultData));
        const result = await JobsService.getAll();
        const expectedResult = defaultData;

        expect(result).toEqual(expectedResult.data);
    });

    it('should return the output according to the giving data in the challenge', async () => {
        api.get.mockImplementation(() => Promise.resolve(defaultData));
        const result = await JobsService.scheduling('2019-11-10 09:00:00', '2019-11-11 12:00:00', 8);
        const expectedResult = [[1, 3], [2]];

        expect(result).toEqual(expectedResult);
    });

    it('should return the output in separeted arrays when the sum of "estimated time" is greater than "max estimated time"', async () => {
        const jobs = {
            data: [
                { id: 1, description: '1', maxExecutionDate: "2019-11-10 12:00:00", estimatedTime: 2 },
                { id: 2, description: '2', maxExecutionDate: "2019-11-11 12:00:00", estimatedTime: 4 },
                { id: 3, description: '3', maxExecutionDate: "2019-11-11 08:00:00", estimatedTime: 7 }
            ]
        };

        api.get.mockImplementation(() => Promise.resolve(jobs));
        const result = await JobsService.scheduling('2019-11-10 09:00:00', '2019-11-11 12:00:00', 8);
        const expectedResult = [[1], [3], [2]];

        expect(result).toEqual(expectedResult);
    });

    it('should not consider the job where "estimated time" is greater than "max estimated time"', async () => {
        const jobs = {
            data: [
                { id: 1, description: '1', maxExecutionDate: "2019-11-10 12:00:00", estimatedTime: 2 },
                { id: 2, description: '2', maxExecutionDate: "2019-11-11 12:00:00", estimatedTime: 9 }, // is greater than "max estimated time"
                { id: 3, description: '3', maxExecutionDate: "2019-11-11 08:00:00", estimatedTime: 6 }
            ]
        };

        api.get.mockImplementation(() => Promise.resolve(jobs));
        const result = await JobsService.scheduling('2019-11-10 09:00:00', '2019-11-11 12:00:00', 8);
        const expectedResult = [[1, 3]];

        expect(result).toEqual(expectedResult);
    });

    it('should not consider the job where "max execution date" is before the execution window', async () => {
        const jobs = {
            data: [
                { id: 1, description: '1', maxExecutionDate: "2019-11-09 12:00:00", estimatedTime: 2 }, // before execution window
                { id: 2, description: '2', maxExecutionDate: "2019-11-11 12:00:00", estimatedTime: 4 },
                { id: 3, description: '3', maxExecutionDate: "2019-11-11 08:00:00", estimatedTime: 6 }
            ]
        };

        api.get.mockImplementation(() => Promise.resolve(jobs));
        const result = await JobsService.scheduling('2019-11-10 09:00:00', '2019-11-11 12:00:00', 8);
        const expectedResult = [[3], [2]];

        expect(result).toEqual(expectedResult);
    });

    it('should not consider the job where "max execution date" is after the execution window', async () => {
        const jobs = {
            data: [
                { id: 1, description: '1', maxExecutionDate: "2019-11-12 12:00:00", estimatedTime: 2 }, // after execution window
                { id: 2, description: '2', maxExecutionDate: "2019-11-11 12:00:00", estimatedTime: 4 },
                { id: 3, description: '3', maxExecutionDate: "2019-11-11 08:00:00", estimatedTime: 6 }
            ]
        };

        api.get.mockImplementation(() => Promise.resolve(jobs));
        const result = await JobsService.scheduling('2019-11-10 09:00:00', '2019-11-11 12:00:00', 8);
        const expectedResult = [[3], [2]];

        expect(result).toEqual(expectedResult);
    });

    it('should order the jobs by "max execution date", if the "max execution date" and "estimated time" are the same, consider the order the original array', async () => {
        const jobs = {
            data: [
                { id: 1, description: '1', maxExecutionDate: "2019-11-10 12:00:00", estimatedTime: 2 },
                { id: 2, description: '2', maxExecutionDate: "2019-11-11 08:00:00", estimatedTime: 6 }, // equal
                { id: 3, description: '3', maxExecutionDate: "2019-11-11 08:00:00", estimatedTime: 6 } // equal
            ]
        };

        api.get.mockImplementation(() => Promise.resolve(jobs));
        const result = await JobsService.scheduling('2019-11-10 09:00:00', '2019-11-11 12:00:00', 8);
        const expectedResult = [[1, 2], [3]];

        expect(result).toEqual(expectedResult);
    });

    it('should not include the job on the list when there is no time enough to be executed', async () => {
        const jobs = {
            data: [
                { id: 1, description: '1', maxExecutionDate: "2019-11-10 12:00:00", estimatedTime: 2 },
                { id: 2, description: '2', maxExecutionDate: "2019-11-11 08:00:00", estimatedTime: 6 },
                { id: 3, description: '3', maxExecutionDate: "2019-11-11 08:00:00", estimatedTime: 6 },
                { id: 4, description: '4', maxExecutionDate: "2019-11-11 08:00:00", estimatedTime: 2 },
                { id: 5, description: '5', maxExecutionDate: "2019-11-11 08:00:00", estimatedTime: 8 }  // no time enough
            ]
        };

        api.get.mockImplementation(() => Promise.resolve(jobs));
        const result = await JobsService.scheduling('2019-11-10 09:00:00', '2019-11-11 12:00:00', 8);
        const expectedResult = [[1, 2], [3, 4]];

        expect(result).toEqual(expectedResult);
    });

    it('should include jobs in the same array group until complete the "max estimated time", and should be order by "max execution date" ASC', async () => {
        const jobs = {
            data: [
                { id: 1, description: '1', maxExecutionDate: "2019-11-10 18:00:00", estimatedTime: 1 },
                { id: 2, description: '2', maxExecutionDate: "2019-11-10 17:00:00", estimatedTime: 1 },
                { id: 3, description: '3', maxExecutionDate: "2019-11-10 16:00:00", estimatedTime: 1 },
                { id: 4, description: '4', maxExecutionDate: "2019-11-10 15:00:00", estimatedTime: 1 },
                { id: 5, description: '5', maxExecutionDate: "2019-11-10 14:00:00", estimatedTime: 1 },
                { id: 6, description: '6', maxExecutionDate: "2019-11-10 13:00:00", estimatedTime: 1 },
                { id: 7, description: '7', maxExecutionDate: "2019-11-10 12:00:00", estimatedTime: 1 },
                { id: 8, description: '8', maxExecutionDate: "2019-11-10 11:00:00", estimatedTime: 1 },
                { id: 9, description: '9', maxExecutionDate: "2019-11-10 10:00:00", estimatedTime: 1 }
            ]
        };

        api.get.mockImplementation(() => Promise.resolve(jobs));
        const result = await JobsService.scheduling('2019-11-10 09:00:00', '2019-11-11 12:00:00', 8);
        const expectedResult = [[9, 8, 7, 6, 5, 4, 3, 2], [1]];

        expect(result).toEqual(expectedResult);
    });
});