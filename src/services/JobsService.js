import api from './api';
import moment from 'moment';
import { orderBy, sumBy } from 'lodash';

async function getAll() {
    const response = await api.get('/jobs');
    return response.data;
}

async function scheduling(executionStartDate, executionEndDate, maxExecutionTime) {
    const jobs = await getAll();
  
    const jobsWithinExecutionWindow = jobs.filter((job) =>
        moment(job.maxExecutionDate).isSameOrAfter(moment(executionStartDate)) &&
        moment(job.maxExecutionDate).isSameOrBefore(moment(executionEndDate)));
    const filterJobsWithinEstimatedTime = jobsWithinExecutionWindow.filter((job) => job.estimatedTime <= maxExecutionTime);
    const orderJobsByMaxExecutionDate = orderBy(filterJobsWithinEstimatedTime, (job) => job.maxExecutionDate);
    const jobsExecutionList = [];
    const currentDate = moment(executionStartDate);

    orderJobsByMaxExecutionDate.forEach(job => {
        const estimatedEndTime = moment(currentDate).add(job.estimatedTime, 'hours');
        if (estimatedEndTime.isSameOrBefore(job.maxExecutionDate)) {
            if (jobsExecutionList.length === 0) {
                jobsExecutionList.push([job]);
            } else {
                const lastArrayItem = jobsExecutionList[jobsExecutionList.length - 1];
                const totalTimeInArray = sumBy(lastArrayItem, (job) => job.estimatedTime);

                if (job.estimatedTime + totalTimeInArray > maxExecutionTime) {
                    jobsExecutionList.push([job]);
                } else {
                    lastArrayItem.push(job);
                }
            }

            const from = moment(currentDate).format('YYYY-MM-DD HH:mm');
            currentDate.add(job.estimatedTime, 'hours');
            const until = moment(currentDate).format('YYYY-MM-DD HH:mm');
            console.log(`Job: ${job.id} (${job.estimatedTime} hrs) | From: ${from} - Until: ${until}`)
        }
    });

    return jobsExecutionList.map((jobList) => jobList.map((job) => job.id));
}

export default {
    getAll,
    scheduling
};