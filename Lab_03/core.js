'use strict';

//const dayjs = require("dayjs");

// i18n and locale
//const localizedFormat = require('dayjs/plugin/localizedFormat');
//dayjs.extend(localizedFormat); // use shortcuts 'LLL' for date and time format
dayjs.extend(window.dayjs_plugin_localizedFormat)
/*
const locale_it = require('dayjs/locale/it');
dayjs.locale('it');
*/

function Task(id, description, isUrgent = false, isPrivate = true, deadline = '') {
    this.id = id;
    this.description = description;
    this.urgent = isUrgent;
    this.private = isPrivate;
    // saved as dayjs object
    this.deadline = deadline && dayjs(deadline);

    this.toString = () => {
        return `Id: ${this.id}, ` +
            `Description: ${this.description}, Urgent: ${this.urgent}, Private: ${this.private}, ` +
            `Deadline: ${this._formatDeadline('LLL')}`;
    }

    this._formatDeadline = (format) => {
        return this.deadline ? this.deadline.format(format) : '<not defined>';
    }

    this._newFormatDeadline = () => {
        if (!this.deadline)
            return '';
        let date = '';
        date = this.deadline.diff(Date.now(), 'd') == 0 ?
            'Today at ' + this.deadline.format('HH:mm') :
            this.deadline.format('dddd D MMMM YYYY') + ' at ' + this.deadline.format('HH:mm');
        return date;
    }
}

function TaskList() {
    this.list = [];

    this.add = (task) => {
        if (!this.list.some(t => t.id == task.id)) {
            this.list = [...this.list, task];
            createTaskElement(task);
        }
        else {
            throw new Error('Duplicate id');
        }
    };

    // this.sortByDeadline = () => {
    //     return [...this.list]
    //         .sort((a, b) => {
    //             const t1 = a.deadline, t2 = b.deadline;
    //             if (t1 === t2) return 0; // works also for null === null
    //             else if (t1 === null || t1 === '') return 1;    // null/empty deadline is the lower value
    //             else if (t2 === null || t2 === '') return -1;
    //             else return t1.diff(t2)
    //         });
    // };

    this.filterByAll = () => {
        return this.list
            .filter((task) => task);
    }

    this.filterByUrgent = () => {
        return this.list
            .filter((task) => task.urgent);
    }

    this.filterByDay = () => {
        return this.list
            .filter((task) => dayjs(task.deadline).diff(Date.now(), 'd') == 0);
    }

    this.filterByNextSevenDays = () => {
        return this.list
            .filter((task) => {
                let res = dayjs(task.deadline).diff(Date.now(), 'd');
                return res > 0 && res <= 7
            });
    }

    this.filterByPrivate = () => {
        return this.list
            .filter((task) => task.private);
    }

}

// check current time is ok
// console.log('Current date and time: ' + dayjs().format('LLL'));

// function sortAndPrint(taskList) {
//     console.log("****** Tasks sorted by deadline (most recent first): ******");
//     // use sort function
//     taskList.sortByDeadline()
//         .forEach((task) => console.log(task.toString()));
// }

// function filterAndPrint(taskList) {
//     console.log("****** Tasks filtered, only (urgent == true): ******");
//     // use filter function
//     taskList.filterByUrgent()
//         .forEach((task) => console.log(task.toString()));
// }


function createTaskElement(task) {
    let listGroup = document.getElementById('listGroup');
    let li = document.createElement('li');
    let divE = document.createElement('div');
    let divI = document.createElement('div');
    let input = document.createElement('input');
    let label = document.createElement('label');
    let svg = document.createElement('div');
    let small = document.createElement('small');

    li.className = 'list-group-item';
    divE.className = 'd-flex w-100 justify-content-between';
    divI.className = 'w-33 custom-control custom-checkbox';
    input.type = 'checkbox';
    input.className = 'custom-control-input';
    input.id = 'check-t' + (listGroup.children.length + 1);
    label.className = (task.urgent == 1) ? 'custom-control-label important' : 'custom-control-label';
    label.htmlFor = 'check-t' + (listGroup.children.length + 1);
    label.innerText = task.description;
    small.className = 'w-33 text-right';
    small.innerText = task._newFormatDeadline();

    divI.appendChild(input);
    divI.appendChild(label);
    divE.appendChild(divI);
    if (task.private == 1) {
        svg.innerHTML = '<svg class="bi bi-person-square" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">   <path fill-rule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clip-rule="evenodd" />        <path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>';
        divE.appendChild(svg);
    }
    divE.appendChild(small);
    li.appendChild(divE);

    document.getElementById('listGroup').appendChild(li);
}

const taskList = new TaskList();

function main(data) {
    // create some dummy tasks
    const t1 = new Task(1, "laundry", 0, 1);
    const t2 = new Task(2, "monday lab", 0, 0, "2021-03-16T09:00:00.000Z");
    const t3 = new Task(3, "phone call", 1, 0, "2021-03-08T15:20:00.000Z");
    const t4 = new Task(4, 'Complete Lab 2', 0, 0, '2021-03-22T14:00:00.000Z');
    const t5 = new Task(5, 'Buy some groceries', 0, 1, '2021-03-28T14:00:00.000Z');
    const t6 = new Task(6, 'Read a good book!', 1, 0);
    const t7 = new Task(7, 'prova next 7 days', 1, 1, "2021-04-03T09:00:00.000Z")

    // create the task list and add the dummy tasks
    taskList.add(t1);
    taskList.add(t2);
    taskList.add(t3);
    taskList.add(t4);
    taskList.add(t5);
    taskList.add(t6);
    taskList.add(t7);

    //sort by deadline and print the taskList
    //sortAndPrint(taskList);

    //filter urgent tasks and print the taskList
    //filterAndPrint(taskList);

    //debugger;
}

main()

//
/* EVENTI */
//
window.addEventListener('load', event => {
    // CLEAR TASK ELEMENTS
    let clearTaskElements = () => document.getElementById('listGroup').innerHTML = '';
    // CHANGE ACTIVE: CAMBIA STATO ACTIVE - EVITA IL REFRESH DEI CONTENUTI
    let changeActive = (e) => {
        if (e.target.classList.contains('active'))
            return 0;
        document.querySelectorAll('#left-sidebar .active')[0].classList.remove('active');
        e.target.classList.add('active');
        return 1;
    }
    // EVENTO CLICK SIDEBAR ALL
    let all = document.getElementById('sidebar-all');
    all.addEventListener('click', e => {
        if (changeActive(e)) {
            clearTaskElements();
            taskList.filterByAll().forEach(task => createTaskElement(task));
        }
    });
    // EVENTO CLICK SIDEBAR IMPORTANT
    let important = document.getElementById('sidebar-important');
    important.addEventListener('click', e => {
        if (changeActive(e)) {
            clearTaskElements();
            taskList.filterByUrgent().forEach((task) => createTaskElement(task));
        }
    });
    // EVENTO CLICK SIDEBAR TODAY
    let today = document.getElementById('sidebar-today');
    today.addEventListener('click', e => {
        if (changeActive(e)){
            clearTaskElements();
            taskList.filterByDay().forEach((task) => createTaskElement(task));
        }
    });
    // EVENTO CLICK SIDEBAR NEXT SEVEN DAYS
    let seven = document.getElementById('sidebar-seven');
    seven.addEventListener('click', e => {
        if (changeActive(e)){
            clearTaskElements();
            taskList.filterByNextSevenDays().forEach((task) => createTaskElement(task));
        }
    });
    // EVENTO CLICK SIDEBAR PRIVATE
    let isPrivate = document.getElementById('sidebar-private');
    isPrivate.addEventListener('click', e => {
        if (changeActive(e)){
            clearTaskElements();
            taskList.filterByPrivate().forEach((task) => createTaskElement(task));
        }
    });
});