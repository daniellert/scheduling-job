import api from './api';
import moment from 'moment';
import { orderBy, sumBy } from 'lodash';

const executionStartDate = moment('2019-11-10 09:00:00');
const executionEndDate = moment('2019-11-11 12:00:00');

async function getAll() {
    const response = await api.get('/jobs');
    return response.data;
}

async function scheduling() {
    const jobs = await getAll();
    const jobsWithinExecutionWindow = jobs.filter((job) =>
        moment(job.maxExecutionDate).isSameOrAfter(executionStartDate) &&
        moment(job.maxExecutionDate).isSameOrBefore(executionEndDate));
    const filterJobsWithinEstimatedTime = jobsWithinExecutionWindow.filter((job) => job.estimatedTime <= 8);
    const orderJobsByMaxExecutionDate = orderBy(filterJobsWithinEstimatedTime, (job) => job.maxExecutionDate);
    const jobsExecutionList = [];
    const currentDate = executionStartDate;

    orderJobsByMaxExecutionDate.forEach(job => {
        const estimatedEndTime = moment(currentDate).add(job.estimatedTime, 'hours');
        if (estimatedEndTime.isSameOrBefore(job.maxExecutionDate)) {
            if (jobsExecutionList.length === 0) {
                jobsExecutionList.push([job]);
            } else {
                const lastArrayItem = jobsExecutionList[jobsExecutionList.length - 1];
                const totalTimeInArray = sumBy(lastArrayItem, (job) => job.estimatedTime);

                if (job.estimatedTime + totalTimeInArray > 8) {
                    jobsExecutionList.push([job]);
                } else {
                    lastArrayItem.push(job);
                }
            }

            currentDate.add(job.estimatedTime, 'hours');
        }
    });

    return jobsExecutionList.map((jobList) => jobList.map((job) => job.id));
}

export default {
    getAll,
    scheduling
};