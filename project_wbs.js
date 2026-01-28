


let selector = () => {
    let classes = ['unmarked-row', 'marked-row'];
    let el = document.createElement('td');
    el.classList.toggle(classes[0]);


    el.addEventListener('click', () => {
        el.classList.toggle(classes[0]);
        el.classList.toggle(classes[1]);
    });

    return el;
}


// const createCell = (data, ) => {
//     view: ``,project_wbs.jsproject_wbs.js
//     state:``
// };

const taskTableStruc = [
    ["select", "select"],
    ["remove", "remove"],
    ["add", "add"],
    ["TaskID", "branch"],
    ["TaskDescription", "text"],
    ["PlannedStartDate", "date", "error-start-date"],
    ["PlannedEndDate", "date", "error-end-date"],
    ["PlannedCost", "number"],
    ['MonitoringFrequency', 'dropdn'],
    ["ProjectLocationID", "dropdn", "error-location"],
    ["Milestone", "checkbox"],
    ["CriticalPath", "checkbox"],
    ["_id", "_id"],
    ["rowKey", "rowKey"],
    ['child', 'child']
];
const taskGrid = {
    select: 0,
    remove: 1,
    add: 2,
    TaskID: 3,
    TaskDescription: 4,
    PlannedStartDate: 5,
    PlannedEndDate: 6,
    PlannedCost: 7,
    MonitoringFrequency: 8,
    ProjectLocationID: 9,
    Milestone: 10,
    CriticalPath: 11,
    _id: 12,
    rowKey: 13,
    child: 14
}

const resGrid = {
    select: 0,
    remove: 1,
    add: 2,
    TaskID: 3,
    ResourceID: 4,
    Description: 5,
    Quantity: 6,
    CostPerUnit: 7,
    Total: 8,
    _id: 9,
    rowKey: 10

}

const itemGrid = {
    select: 0,
    remove: 1,
    add: 2,
    TaskID: 3,
    ItemType: 4,
    UOM: 5,
    Description: 6,
    Quantity: 7,
    CostPerUnit: 8,
    Total: 9,
    Top3: 10,
    _id: 11,
    rowKey: 12

}


const resTableStruc = [
    [
        "select", "select"
    ],
    [
        "remove", "remove"
    ],
    [
        "add_d", "add_d"
    ],
    [
        'TaskID', "text"
    ],
    [
        "ResourceID", "dropdn"
    ],
    [
        "Description", "text"
    ],
    [
        "Quantity", "number"
    ],
    [
        "CostPerUnit", "number"
    ],
    [
        "Total", "number"
    ],
    [
        "_id", "_id"
    ],
    [
        "rowKey", "rowKey"
    ]

];

const itemTableStruc = [
    ["select", "select"],
    ["remove", "remove"],
    ["add_d", "add_d"],
    ['TaskID', "text"],
    ["ItemType", "dropdn"],
    ["UOM", "dropdn"],
    ["Description", "text"],
    ["Quantity", "number"],
    ["CostPerUnit", "number"],
    ["Total", "number"],
    ['Top3', 'Top3'],
    ["_id", "_id"],
    ["rowKey", "rowKey"]

];

const rowDefaults = {
    _id: undefined,
    TaskDescription: "no details",
    MonitoringFrequency: null,
    PlannedStartDate: null,
    PlannedEndDate: null,
    PlannedCost: 0,
    ProjectLocationID: '',
    Milestone: false,
    CriticalPath: false
};

const resRowDefaults = {
    _id: undefined,
    TaskID: "1",
    ResourceID: '',
    Description: "no details",
    Quantity: 0,
    CostPerUnit: 0,
    Total: 0,
    TaskID: '',
    Type: "TaskPlannedResource"
};
const itemRowDefaults = {
    _id: undefined,
    TaskID: "1",
    UOM: '',
    ItemType: '',
    Description: "no details",
    Quantity: 0,
    CostPerUnit: 0,
    Total: 0,
    TaskID: '',
    Type: "TaskPlannedBOQ",
    Top3: false
};


var responsiveHelper = undefined;
var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var lastCell;
var taskTable = document.getElementsByClassName("table")[0];
let tableChilds = {};
const resTable = (taskId) => tableChilds['T-' + taskId] ? tableChilds['T-' + taskId].querySelector('.resources-table') : { rows: [], nodeName: 'OBJECT' };
const itemTable = (taskId) => tableChilds['T-' + taskId] ? tableChilds['T-' + taskId].querySelector('.resources-table-boq') : { rows: [], nodeName: 'OBJECT' };

let djl = document.getElementById('davy-jones-locker');
var startDateCtrl = document.getElementById("start-date");
var endDateCtrl = document.getElementById("end-date");
var locationsCtrl = document.getElementById("locations");
var taskDescriptionCtrl = document.getElementById("task-description");
var removeTaskCtrl = document.getElementById("remove-task");
var insertCtrl = document.getElementById("insert");
var frequenciesCtrl = document.getElementById("frequencies");
var insertResourceCtrl = document.getElementById("insertResource");


var resourceDescriptionCtrl = document.getElementById("resource-description");
var resourceCostCtrl = document.getElementById("resource-cost");
var removeResourceCtrl = document.getElementById("remove-resource");

var itemTypesCtrl = document.getElementById("itemTypes");
var uomsCtrl = document.getElementById("uoms");
var boqDescriptionCtrl = document.getElementById("boq-description");
var boqCostCtrl = document.getElementById("boq-cost");
var boqQuantityCtrl = document.getElementById("boq-quantity");
var removeBoqCtrl = document.getElementById("remove-boq");

var head = document.getElementsByClassName("head")[0];


var costY = 1;

let counter = 1;
let levelCount = {};
let wbsl = wbsd.length;
if (wbsl > 1) document.getElementsByTagName('form')[0].remove();
else document.getElementsByTagName('form')[0].classList.remove('hid');
let r = taskTable.rows;
let filRes = [];


const onInputFrequency = ({ target }) => {
    let taskId = taskTable.rows[target.dataset.y].cells[taskGrid.TaskID].textContent;
    if (resTable(taskId).rows.length == 0) {
        taskTable.rows[target.dataset.y].cells[target.dataset.x].innerHTML = `<span class='hid'>${target.value}</span><span>${frequenciesCtrl.selectedOptions.length > 0
            ? frequenciesCtrl.selectedOptions[0].text
            : ""}</span>`;
    } else {
        let cell = taskTable.rows[target.dataset.y].cells[taskGrid.TaskDescription];
        cell.classList.add('error-wbs-change');
        setTimeout(() => cell.classList.remove('error-wbs-change'), 3500);
    }
};

const onInputLocation = ({ target }) => {
    target.classList.remove('anim-open');
    let taskId = taskTable.rows[target.dataset.y].cells[taskGrid.TaskID].textContent;
    // if (resTable(taskId).rows.length == 0) {
    if (true || resTable(taskId).rows.length) {
        // taskTable.rows[target.dataset.y].cells[target.dataset.x].innerHTML = `<span class='hid'>${target.value}</span><span>${locationsCtrl.selectedOptions.length > 0
        //     ? locationsCtrl.selectedOptions[0].text
        //     : ""}</span>`;

        taskTable.rows[target.dataset.y].cells[taskGrid.ProjectLocationID].classList.remove('error-location');
        // let i = + target.dataset.y + 1;
        // let currTaskId = taskTable.rows[target.dataset.y].cells[taskGrid.TaskID].textContent.split(".")[0];
        let rws = taskTable.getElementsByClassName(`pr${getParentTask(taskTable.rows[target.dataset.y].id).split('-')[1]}`);
        Array.from(rws).forEach(r => {
            r.cells[target.dataset.x].innerHTML = `<span class='hid'>${target.value}</span><span>${locationsCtrl.selectedOptions.length > 0
                ? locationsCtrl.selectedOptions[0].text
                : ""}</span>`;
        });


        // while (i < taskTable.rows.length && currTaskId == taskTable.rows[i].cells[taskGrid.TaskID].textContent.split(".")[0]) {
        //     taskTable.rows[i++].cells[target.dataset.x].innerHTML = `<span class='hid'>${target.value}</span><span>${locationsCtrl.selectedOptions.length > 0
        //         ? locationsCtrl.selectedOptions[0].text
        //         : ""}</span>`;
        // }
    } else {
        let cell = taskTable.rows[target.dataset.y].cells[taskGrid.TaskDescription];
        cell.classList.add('error-wbs-change');
        setTimeout(() => cell.classList.remove('error-wbs-change'), 3500);
    }
}

const onInputStartDate = ({ target }) => {
    let taskId = taskTable.rows[target.dataset.y].cells[taskGrid.TaskID].textContent;
    if (resTable(taskId).rows.length == 0) {
        taskTable.rows[target.dataset.y].cells[target.dataset.x].textContent = target.value.Date2UIDate();
        isEmpty(taskTable.rows[target.dataset.y].cells[target.dataset.x]);
        calcMinDate(target.value.Date2UIDate(), getParentTask(taskTable.rows[target.dataset.y].cells[taskGrid.TaskID].textContent));
    } else {
        let cell = taskTable.rows[target.dataset.y].cells[taskGrid.TaskDescription];
        cell.classList.add('error-wbs-change');
        setTimeout(() => cell.classList.remove('error-wbs-change'), 3500);
    }

}

const onInputEndDate = ({ target }) => {
    let taskId = taskTable.rows[target.dataset.y].cells[taskGrid.TaskID].textContent;
    if (resTable(taskId).rows.length == 0) {
        taskTable.rows[target.dataset.y].cells[target.dataset.x].textContent = target.value.Date2UIDate();
        isEmpty(taskTable.rows[target.dataset.y].cells[target.dataset.x]);
        calcMaxDate(target.value.Date2UIDate(), getParentTask(taskTable.rows[target.dataset.y].cells[taskGrid.TaskID].textContent));
    } else {
        let cell = taskTable.rows[target.dataset.y].cells[taskGrid.TaskDescription];
        cell.classList.add('error-wbs-change');
        setTimeout(() => cell.classList.remove('error-wbs-change'), 3500);
    }

}

const onInputTaskDescription = ({ target }) => {
    taskTable.rows[target.dataset.y].cells[target.dataset.x].textContent = target.value;
}

const onInputResourceDescription = ({ target }) => {
    // let taskId = taskTable.rows[target.dataset.y].cells[taskGrid.TaskID].textContent;
    let taskId = target.dataset.task;
    resTable(taskId).rows[target.dataset.y].cells[target.dataset.x].textContent = target.value;
}

const onInputBOQDescription = ({ target }) => {
    // let taskId = taskTable.rows[target.dataset.y].cells[taskGrid.TaskID].textContent;
    let taskId = target.dataset.task;
    itemTable(taskId).rows[target.dataset.y].cells[target.dataset.x].textContent = target.value;
}

const onClickInsertResource = ({ target }) => {
    let y = target.parentElement.dataset.y;
    let row = taskTable.rows[y];
    let taskId = target.parentElement.dataset.task;
    // itemTable(taskId).rows[target.dataset.y].cells[target.dataset.x].textContent = target.value;
    // let taskId = target.dataset.task;
    let columns = row.cells;
    let dt1 = isEmpty(columns[taskGrid.PlannedStartDate]);
    let dt2 = isEmpty(columns[taskGrid.PlannedEndDate]);
    if (!dt1 && !dt2) {
        clearCurrentRow();


        let exists = resTable(taskId).nodeName == 'TABLE' || itemTable(taskId).nodeName == 'TABLE';
        if (!exists) {
            let mcn = mainChildDiv.cloneNode(true);
            tableChilds['T-' + taskId] = mcn;
            row.cells[taskGrid.child].appendChild(mcn);
        }

        if (target.getAttribute('value') == 1) {
            let table = resTable(taskId);

            let total = table.rows.length == 0 ? 1 : Number(table.rows[table.rows.length - 1].cells[resGrid.Total].textContent);
            if (total != 0) {
                resRowDefaults.TaskID = taskId;
                createResRow(resRowDefaults);
            }

        } else {
            let table = itemTable(taskId);

            let total = table.rows.length == 0 ? 1 : Number(table.rows[table.rows.length - 1].cells[itemGrid.Total].textContent);
            if (total != 0) {
                itemRowDefaults.TaskID = taskId;
                createResRow(itemRowDefaults);
            }

        }
        openChild(taskId);
    }
    target.parentElement.classList.remove('anim-open');

}

const onClickInsert = ({ target }) => {
    let y = insertCtrl.dataset.y;
    let row = taskTable.rows[y];
    let taskId = insertCtrl.dataset.task;
    // let locationCell = row.cells[taskGrid.ProjectLocationID];
    if (true || locationCell.textContent.length > 0) {
        // rowDefaults.ProjectLocationID = locationCell.children[0].textContent;
        clickAdd({ dataset: { y: y }, value: target.getAttribute('value') });
    } else locationCell.classList.add(taskTableStruc[taskGrid.ProjectLocationID][2]);
    clearCurrentRow();
    // resetCurrentRow(taskId);
    insertCtrl.classList.remove('anim-open');
}


const onInputRemoveTask = ({ target }) => {
    removeTask(target);
    target.value = null;
}

const onInputRemoveResource = ({ target }) => {
    removeCost(target);
    target.value = null;
}

const onInputRemoveBOQ = ({ target }) => {
    removeCost(target);
    target.value = null;
}


// const onInputInsert = ({ target }) => {
//     let location = document.getElementById(taskTable.rows[target.dataset.y].id.split('.')[0]).cells[taskGrid.ProjectLocationID];
//     if (location.textContent.length > 0) {
//         rowDefaults.ProjectLocationID = location.children[0].textContent;
//         clickAdd(target);

//     } else location.classList.add(taskTableStruc[taskGrid.ProjectLocationID][2]);
//     target.value = null;
// }


const onInputItemTypes = ({ target }) => {
    // let taskId = taskTable.rows[target.dataset.y].cells[taskGrid.TaskID].textContent;
    let taskId = target.dataset.task;
    let row = itemTable(taskId).rows[target.dataset.y];
    row.cells[target.dataset.x].innerHTML = `<span class='hid'>${target.value}</span><span>${itemTypesCtrl.selectedOptions.length > 0
        ? itemTypesCtrl.selectedOptions[0].text
        : ""}</span>`;
    row.cells[itemGrid.UOM].innerHTML = `<span class='hid'></span><span></span>`;
    target.value = null;
    setStyles(uomsCtrl);

}


const onInputUoms = ({ target }) => {
    // let taskId = taskTable.rows[target.dataset.y].cells[taskGrid.TaskID].textContent;
    let taskId = target.dataset.task;
    itemTable(taskId).rows[target.dataset.y].cells[target.dataset.x].innerHTML = `<span class='hid'>${target.value}</span><span>${uomsCtrl.selectedOptions.length > 0
        ? uomsCtrl.selectedOptions[0].text
        : ""}</span>`;
    target.value = null;
}

frequenciesCtrl.addEventListener("input", onInputFrequency);
locationsCtrl.addEventListener("input", onInputLocation);
startDateCtrl.addEventListener('input', onInputStartDate);
endDateCtrl.addEventListener('input', onInputEndDate);
taskDescriptionCtrl.addEventListener('input', onInputTaskDescription);
resourceDescriptionCtrl.addEventListener('input', onInputResourceDescription);
boqDescriptionCtrl.addEventListener('input', onInputBOQDescription);
insertCtrl.addEventListener('click', onClickInsert);
insertResourceCtrl.addEventListener('click', onClickInsertResource);
//removeTaskCtrl.addEventListener('input', onInputRemoveTask);
uomsCtrl.addEventListener("input", onInputUoms);
itemTypesCtrl.addEventListener("input", onInputItemTypes);
removeResourceCtrl.addEventListener('input', onInputRemoveResource);
removeBoqCtrl.addEventListener('input', onInputRemoveBOQ);
boqCostCtrl.addEventListener('input', updateBOQCost);
boqQuantityCtrl.addEventListener('input', updateBOQCost);
resourceCostCtrl.addEventListener('input', updateResourceCost);
let lastCtrl;

const resourceControls = Array.from(document.getElementsByClassName('resourceControls'));
const taskControls = Array.from(document.getElementsByClassName('taskControls'));
const boqControls = Array.from(document.getElementsByClassName('boqControls'));

function updateResourceCost({ target }) {
    let taskId = target.dataset.task;
    let resRows = resTable(taskId).rows;
    let currentRowCells = resRows[target.dataset.y].cells;
    currentRowCells[target.dataset.x].textContent = Number(target.value).toFixed(2);
    currentRowCells[resGrid.Total].textContent = (Number(currentRowCells[resGrid.Quantity].textContent) * Number(currentRowCells[resGrid.CostPerUnit].textContent)).toFixed(2);
    let costBreakup = {
        boqBreakup: calcSubTotal(itemTable(taskId).rows, itemGrid.ItemType, [itemGrid.Quantity, itemGrid.Total]),
        resourceBreakup: calcSubTotal(resRows, 0, [resGrid.Quantity, resGrid.Total])
    };
    rollUpCost(costBreakup);
}

function updateBOQCost({ target }) {
    let top3 = { 1: { row: undefined }, 2: { row: undefined }, 3: { row: undefined } }
    let taskId = target.dataset.task;
    let boqRows = itemTable(taskId).rows;
    let currentRowCells = boqRows[target.dataset.y].cells;
    currentRowCells[target.dataset.x].textContent = Number(target.value).toFixed(2);
    currentRowCells[itemGrid.Total].textContent = (Number(currentRowCells[itemGrid.Quantity].textContent) * Number(currentRowCells[itemGrid.CostPerUnit].textContent)).toFixed(2);
    let l = boqRows.length;
    for (let i = 0; i < l; i++) {
        let row = boqRows[i];
        row.cells[itemGrid.Top3].textContent = 0;
        if (row.cells[itemGrid.ItemType].children[0].textContent == 4) {
            let v = Number(row.cells[itemGrid.Total].textContent);
            if (top3[1].row == undefined) top3[1] = { row: i, value: v };
            else if (top3[1].value < v) {
                top3[3] = { ...top3[2] };
                top3[2] = { ...top3[1] };
                top3[1] = { row: i, value: v };
            } else if (top3[2].row == undefined) top3[2] = { row: i, value: v };
            else if (top3[2].value < v) {
                top3[3] = { ...top3[2] };
                top3[2] = { row: i, value: v };
            } else if (top3[3].row == undefined || top3[3].value < v) top3[3] = { row: i, value: v };

        }
    };
    if (top3[1].row) boqRows[top3[1].row].cells[itemGrid.Top3].textContent = 1;
    if (top3[2].row) boqRows[top3[2].row].cells[itemGrid.Top3].textContent = 2;
    if (top3[3].row) boqRows[top3[3].row].cells[itemGrid.Top3].textContent = 3;
    let costBreakup = {
        boqBreakup: calcSubTotal(boqRows, itemGrid.ItemType, [itemGrid.Quantity, itemGrid.Total]),
        resourceBreakup: calcSubTotal(resTable(taskId).rows, null, [resGrid.Quantity, resGrid.Total])
    };
    rollUpCost(costBreakup);
}



function calcSubTotal(rows, groupBy, columns) {
    let costs = {}, length = rows.length;
    let total = 0, i = 0;
    let key;
    const sum = (col) => {
        costs[key][col] = (costs[key][col] ? costs[key][col] : 0) + Number(rows[i].cells[col].textContent);
    };
    for (i = 0; i < length; i++) {
        key = groupBy ? rows[i].cells[groupBy].children[0].textContent : 0;
        if (!costs[key]) costs[key] = {};
        columns.forEach(sum);
    }
    return costs;
}


function rollUpCost(costBreakup) {
    const resourceBreakup = costBreakup.resourceBreakup;
    const boqBreakup = costBreakup.boqBreakup;
    let taskTotalCost = (boqBreakup ? Object.keys(boqBreakup).reduce((prev, curr) => (prev + boqBreakup[curr][itemGrid.Total]), 0) : 0) + (resourceBreakup ? Object.keys(resourceBreakup).reduce((prev, curr) => (prev + resourceBreakup[curr][resGrid.Total]), 0) : 0);
    let taskRows = taskTable.rows;
    let length = taskRows.length;
    let taskIds = getTasks(taskRows[costY].cells[taskGrid.TaskID].textContent);
    head.cells[2].textContent = (head.cells[2].textContent.toNumber() - taskRows[costY].cells[taskGrid.PlannedCost].textContent.toNumber() + taskTotalCost);
    for (let i = 1; i < length; i++) {
        let taskCell = taskRows[i].cells[taskGrid.TaskID];
        if (taskIds.includes(taskCell.textContent)) {
            let value = taskRows[i].cells[taskGrid.PlannedCost].textContent.toNumber() - taskRows[costY].cells[taskGrid.PlannedCost].textContent.toNumber() + taskTotalCost;
            taskRows[i].cells[taskGrid.PlannedCost].textContent = value;
        }
    }
    taskRows[costY].cells[taskGrid.PlannedCost].textContent = taskTotalCost;
}

var row;
let mainChildDiv = document.getElementById('main-child-div');

if (wbsl > 0) {
    head.cells[0].textContent = wbsd[0].PlannedStartDate.Date2UIDate();
    head.cells[1].textContent = wbsd[0].PlannedEndDate.Date2UIDate();
    head.cells[2].textContent = wbsd[0].PlannedCost;
    let i = 1;
    let y;

    while (i < wbsl) {
        y = i + 1;
        createRow(y - 1, wbsd[i].TaskID, wbsd[i]);
        setLevel(r[y - 1], wbsd[i].TaskID);
        if (wbsd[i++].WorkPackage) {
            r[y - 1].cells[taskGrid.add].classList.remove("plus");
            r[y - 1].cells[taskGrid.add].classList.add("wbs-plus");
            r[y - 1].cells[taskGrid.TaskID].classList.remove("closed");
            r[y - 1].cells[taskGrid.TaskID].classList.add("work-package");
            r[y - 1].classList.add("wps-row");
            r[y - 1].cells[taskGrid.PlannedStartDate].classList.add("date-picker");
            r[y - 1].cells[taskGrid.PlannedEndDate].classList.add("date-picker");
            let mcn = mainChildDiv.cloneNode(true);
            tableChilds['T-' + wbsd[i - 1].TaskID] = mcn;
            r[y - 1].cells[taskGrid.child].appendChild(mcn);
        }
    }

    let firstRow = document.getElementsByClassName('wps-row')[0];
    costY = firstRow.rowIndex;

    r[costY].classList.add('current-row');

    ResourcesData.forEach(rs => { createResRow(rs) });
} else {
    // Get project info from cookies and header
    let projectInfo = {
        startDate: head.cells[0].textContent || new Date().formatDate(),
        endDate: head.cells[1].textContent || new Date().formatDate(),
        cost: head.cells[2].textContent ? head.cells[2].textContent.toNumber() : 0,
        name: projectName || 'Project'
    };
    
    let defaultTask1 = Object.assign({}, rowDefaults, {
        TaskID: '1',
        TaskDescription: projectInfo.name ? 'Phase 1' : 'Phase 1',
        PlannedStartDate: projectInfo.startDate,
        PlannedEndDate: projectInfo.endDate,
        PlannedCost: projectInfo.cost
    });
    createRow(1, '1', defaultTask1);
}

//taskTable.rows[costY].insertAdjacentElement('afterend', document.getElementById('main-child-div'));

function indent(value) {
    return "<tab/>".repeat(value.toString().split(".").length) + value;
}

function nextId(value, level) {
    let levels = value.split(".");
    level = level == -1
        ? 0
        : levels.length - (1 + level);
    levels[level] = parseInt(levels[level]) + 1;
    return levels.reduce((c, s) => (
        c.length > 0
            ? c + "."
            : "") + s, "");
}

function decrId(value, start, scale) {
    let levels = value.split(".");
    let level = start
        ? 0
        : levels.length - (1 + scale);
    levels[level] = parseInt(levels[level]) - 1;
    return levels.reduce((c, s) => (
        c.length > 0
            ? c + "."
            : "") + s, "");
}

function getLevel(v) {
    if (typeof v == "object")
        return v.cells[3].textContent.split(".").length;
    if (typeof v == "string")
        return v.split(".").length;
    if (typeof v == "number")
        return v.toString().split(".").length;
}

function getText(v) {
    return v.cells[3].textContent;
}

function setLevel(row, value) {
    let cell = row.cells[taskGrid.TaskID];
    if (cell.parentElement.classList.contains('wps-row'))
        resetResources(cell.textContent, value, row.cells[taskGrid.rowKey].textContent);
    cell.innerHTML = indent(value);
    row.id = `l-${value}`;
    let parentId = getLevel(cell.textContent) == 1
        ? "0"
        : getParentTask(cell.textContent);
    row.classList.add(`pr${parentId}`);

}

function getWPS(rws, ar) {
    Array.from(rws).forEach(rw => {
        if (rw.classList.contains('wps-row'))
            ar.push(rw.cells[3].textContent);
        else if (rw.cells[3].classList.contains('open') || rw.cells[3].classList.contains('closed')) {
            getWPS(document.getElementsByClassName(`pr${rw.cells[3].textContent}`), ar);
        }
    });
}

function resetResId(task, newId) {
    if (task.classList.contains('wps-row')) {
        let taskId = task.cells[taskGrid.TaskID].textContent;
        let xu = 1;
        let resTableTmp = resTable(taskId);
        while (xu < resTableTmp.rows.length) {
            if (resTableTmp.rows[xu].cells[resGrid.TaskID].textContent == taskId)
                resTableTmp.rows[xu].cells[resGrid.TaskID].textContent = newId;
            xu++;
        }
    }
}

function removeTask(target) {
    let rows = taskTable.rows,
        y = + target.dataset.y;
    let initialY = y;
    let rootLevel = getLevel(rows[y]);
    let lastCount = getText(rows[y]);
    let wbs_under = [];
    getWPS(document.getElementsByClassName(`pr${rows[y].cells[taskGrid.TaskID].textContent}`), wbs_under);
    if (rows[y].cells[taskGrid.PlannedCost].textContent.toNumber() > 0) {
        let cell = rows[y].cells[taskGrid.TaskDescription];
        cell.classList.add('error-wbs-remove');
        setTimeout(() => cell.classList.remove('error-wbs-remove'), 3500);
        return;
    }
    clearCurrentRow();
    rows[y].remove();
    if (target.value == 1) {
        while (y < rows.length && getLevel(rows[y]) > rootLevel) {
            rows[y].remove();
        }
        y = initialY;
        if (getLevel(rows[y]) == rootLevel) {
            resetResId(rows[y], lastCount);
            setLevel(rows[y++], lastCount)

        };
        while (y < rows.length && getLevel(rows[y]) >= rootLevel) {
            let currValue = getText(rows[y]);
            let currLevel = getLevel(currValue);

            if (currLevel == 1) {
                lastCount = decrId(currValue, true);
                resetResId(rows[y], lastCount);
                setLevel(rows[y++], lastCount);

            } else if (currLevel > 1 && (currLevel == rootLevel || getLevel(lastCount) == currLevel)) {
                lastCount = decrId(currValue, false, 0);
                resetResId(rows[y], lastCount);
                setLevel(rows[y++], lastCount);
            } else if (currLevel > 1 && currLevel > getLevel(lastCount) && rootLevel > 1) {
                lastCount = decrId(currValue, false, 1);
                resetResId(rows[y], lastCount);
                setLevel(rows[y++], lastCount);
            } else if (currLevel > 1 && currLevel > getLevel(lastCount) && rootLevel == 1) {
                lastCount = decrId(currValue, true);
                resetResId(rows[y], lastCount);
                setLevel(rows[y++], lastCount);
            } else if (currLevel > 1 && getLevel(lastCount) > currLevel && currLevel > rootLevel) {
                lastCount = decrId(currValue, false, 1);
                resetResId(rows[y], lastCount);
                setLevel(rows[y++], lastCount);
            }

        }
    }
}



function clearCurrentRow() {
    let cr = document.getElementsByClassName('current-row');
    if (cr.length > 0)
        cr[0].classList.remove('current-row');
}

function clickAdd(target) {
    let rows = taskTable.rows,
        initialY = + target.dataset.y;
    let y = initialY + 1;
    let rootLevel = getLevel(rows[initialY]);
    if (target.value == 1) {
        while (y < rows.length && getLevel(rows[y]) > rootLevel) {
            y++;
        }
        let lastCount = nextId(
            getText(rows[initialY]), rootLevel == 1
            ? -1
            : 0);
        //  rowDefaults.ProjectLocationID = taskTable.rows[initialY].cells[taskGrid.ProjectLocationID].children[0].textContent;
        createRow(y, lastCount, rowDefaults);
        setLevel(rows[y++], lastCount);
        let lastLevel = getLevel(lastCount);
        while (y < rows.length && lastLevel >= rootLevel && getLevel(getText(rows[y])) >= rootLevel) {
            let cellValue = getText(rows[y]);
            let currLevel = getLevel(cellValue);
            if (currLevel > lastLevel) {
                lastCount = nextId(cellValue, -1);
                setLevel(rows[y++], lastCount);
            } else if (currLevel == lastLevel && currLevel > rootLevel) {
                lastCount = nextId(cellValue, -1);
                setLevel(rows[y++], lastCount);
            } else if (currLevel == lastLevel && currLevel > 1) {
                lastCount = nextId(cellValue, 0);
                setLevel(rows[y++], lastCount);
            } else if (currLevel == lastLevel && currLevel == 1) {
                lastCount = nextId(cellValue, -1);
                setLevel(rows[y++], lastCount);
            } else if (currLevel < lastLevel && currLevel == rootLevel && rootLevel == 1) {
                lastCount = nextId(cellValue, 0);
                setLevel(rows[y++], lastCount);
            } else if (currLevel < lastLevel && currLevel >= rootLevel) {
                lastCount = nextId(
                    cellValue, currLevel > 1
                    ? 0
                    : 1);
                setLevel(rows[y++], lastCount);
            }
            lastLevel = getLevel(lastCount);
        }
    } else if (target.value > 1) {
        let rootLevel = getLevel(rows[initialY]);
        let lastCount = getText(rows[y - 1]) + ".1";
        if (target.value < 4) {
            while (y < rows.length && getLevel(rows[y]) > rootLevel) {
                if (getLevel(rows[y]) == getLevel(lastCount))
                    lastCount = nextId(getText(rows[y]), 0);
                y++;
            }
        }
        let wpsRowDefaults;
        if (target.value > 2) {
            wpsRowDefaults = {
                ...rowDefaults,
                MonitoringFrequency: '2',
                WorkPackage: true
            };
            createRow(y, lastCount, wpsRowDefaults);
        } else
            createRow(y, lastCount, rowDefaults);
        if (target.value > 2) {
            rows[y].cells[2].classList.remove("plus");
            rows[y].cells[2].classList.add("wbs-plus");
            rows[y].cells[taskGrid.TaskID].classList.remove("closed");
            rows[y].cells[taskGrid.TaskID].classList.add("work-package");
            rows[y].cells[taskGrid.MonitoringFrequency].classList.add("dropdn");
            rows[y].classList.add("wps-row");
            rows[y].cells[taskGrid.PlannedStartDate].classList.add("date-picker");
            rows[y].cells[taskGrid.PlannedEndDate].classList.add("date-picker");
            clearCurrentRow();
            costY = y;
            taskTable.rows[costY].classList.add('current-row');
        }
        y++;
        if (target.value < 4) {
            while (y < rows.length && getLevel(rows[y]) > rootLevel) {
                if (getLevel(rows[y]) == getLevel(lastCount)) {
                    setLevel(rows[y], nextId(lastCount, 1));
                    lastCount = getText(rows[y]);
                } else if (getLevel(rows[y]) > getLevel(lastCount)) {
                    setLevel(rows[y], nextId(rows[y], 1));
                }
                y++;
            }
        } else {
            while (y < rows.length && getLevel(lastCount) >= rootLevel && getLevel(getText(rows[y])) > rootLevel) {
                let cellValue = getText(rows[y]);
                let currLevel = getLevel(cellValue);
                let lastLevel = getLevel(lastCount);
                if (currLevel > lastLevel) {
                    lastCount = nextId(cellValue, currLevel - lastLevel);
                    setLevel(rows[y], lastCount);
                } else if (currLevel == lastLevel && currLevel > rootLevel) {
                    lastCount = nextId(cellValue, 0);
                    setLevel(rows[y], lastCount);
                } else if (currLevel < lastLevel && currLevel > rootLevel) {
                    lastCount = nextId(
                        cellValue, currLevel > 1
                        ? 0
                        : -1);
                    setLevel(rows[y], lastCount);
                }
                y++;
            }
        }
    }
}

function calcMinDate(minDate, parentId) {
    let tasks = document.getElementsByClassName("pr" + parentId);
    let len = tasks.length;
    for (let i = 0; i < len; i++) {
        let currCell = tasks[i].cells[taskGrid.PlannedStartDate];
        if (currCell.textContent.length > 0 && new Date(currCell.textContent) < new Date(minDate))
            minDate = currCell.textContent;
    }
    let parentCell = document.getElementById(`l-${parentId}`).cells[taskGrid.PlannedStartDate];
    if (parentCell.textContent != minDate) {
        parentCell.textContent = minDate;
        if (getLevel(parentId) > 1) {
            calcMinDate(minDate, getParentTask(parentId));
        } else {
            let headCell = head.cells[0];
            if (headCell.textContent.length == 0 || new Date(headCell.textContent) > new Date(minDate))
                headCell.textContent = minDate;
            else {
                let tasks = document.getElementsByClassName("pr0");
                let len = tasks.length;
                for (let i = 0; i < len; i++) {
                    let currCell = tasks[i].cells[taskGrid.PlannedStartDate];
                    if (new Date(currCell.textContent) < new Date(minDate))
                        minDate = currCell.textContent;
                }
                headCell.textContent = minDate;
            }
        }
    }
}


function calcMaxDate(maxDate, parentId) {
    let tasks = document.getElementsByClassName("pr" + parentId);
    let len = tasks.length;
    for (let i = 0; i < len; i++) {
        let currCell = tasks[i].cells[taskGrid.PlannedEndDate];
        if (currCell.textContent.length > 0 && new Date(currCell.textContent) > new Date(maxDate))
            maxDate = currCell.textContent;
    }
    let parentCell = document.getElementById(`l-${parentId}`).cells[taskGrid.PlannedEndDate];
    if (parentCell.textContent != maxDate) {
        parentCell.textContent = maxDate;
        if (getLevel(parentId) > 1) {
            calcMaxDate(maxDate, getParentTask(parentId));
        } else {
            let headCell = head.cells[1];
            if (headCell.textContent.length == 0 || new Date(headCell.textContent) < new Date(maxDate))
                headCell.textContent = maxDate;
            else {
                let tasks = document.getElementsByClassName("pr0");
                let len = tasks.length;
                for (let i = 0; i < len; i++) {
                    let currCell = tasks[i].cells[taskGrid.PlannedEndDate];
                    if (new Date(currCell.textContent) > new Date(maxDate))
                        maxDate = currCell.textContent;
                }
                headCell.textContent = maxDate;
            }
        }
    }
}


function removeCost(target) {
    let table, struc, value;
    if (target.dataset.g == 'resources-table-boq') {
        table = itemTable(target.dataset.taskId);
        struc = [itemGrid.Quantity, itemGrid.Total];
        value = table.rows[target.dataset.y].cells[itemGrid.Total].textContent;
        table1 = resTable(target.dataset.taskId);
        struc1 = [resGrid.Quantity, resGrid.Total];
        table.deleteRow(target.dataset.y);
        if (Number(value) != 0) {
            rollUpCost({ resourceBreakup: calcSubTotal(table1.rows, 0, struc1), boqBreakup: calcSubTotal(table.rows, 0, struc) });
        }
    } else {
        table = resTable(target.dataset.taskId);
        struc = [resGrid.Quantity, resGrid.Total];
        value = table.rows[target.dataset.y].cells[resGrid.Total].textContent;
        table1 = itemTable(target.dataset.taskId);
        struc1 = [itemGrid.Quantity, itemGrid.Total];
        table.deleteRow(target.dataset.y);
        if (Number(value) != 0) {
            rollUpCost({ resourceBreakup: calcSubTotal(table.rows, 0, struc), boqBreakup: calcSubTotal(table1.rows, 0, struc1) });
        }
    }


}

function onResourceSelect(target, data) {
    // let len = taskTable.rows.length;
    let taskId = target.dataset.task;
    let resRows = resTable(taskId).rows;
    // let resLen = resRows.length;
    let cells = resRows[target.dataset.y].cells;
    let task = document.getElementById(`l-${taskId}`).cells;
    let currentCycleDays = businessDays(new Date(task[taskGrid.PlannedStartDate].textContent), new Date(task[taskGrid.PlannedEndDate].textContent));
    let totalBusinessDays = businessDays(monthStartDate(new Date(task[taskGrid.PlannedStartDate].textContent)), monthEndDate(new Date(task[taskGrid.PlannedStartDate].textContent)));
    cells[resGrid.Quantity].textContent = Number(currentCycleDays).toFixed(0);
    const rateDivisor = {
        'Monthly': totalBusinessDays,
        'Fortnightly': totalBusinessDays * 0.5,
        'Weekly': totalBusinessDays * 0.25,
        'Daily': 1,
    }
    let resourceCurrency = data.currency.toUpperCase(), projectCurrency = Cookies.get('projectCurrency');
    axios.get(`http://data.fixer.io/api/latest?access_key=4d24371dc9db9ea3e38085b2f9375827&base=EUR&symbols=${resourceCurrency},${projectCurrency}`)
        .then(({data:{rates}}) => {
            let convertedRate =  (rates[projectCurrency]/rates[resourceCurrency])*Number(data.rate);
            const ratePerDay = convertedRate / rateDivisor[data.unit];
            cells[resGrid.CostPerUnit].textContent = (ratePerDay).toFixed(2);
            cells[resGrid.Total].textContent = (ratePerDay * currentCycleDays).toFixed(2);
            let costBreakup = {
                boqBreakup: calcSubTotal(itemTable(taskId).rows, itemGrid.ItemType, [itemGrid.Quantity, itemGrid.Total]),
                resourceBreakup: calcSubTotal(resRows, 0, [resGrid.Quantity, resGrid.Total])
            };
            rollUpCost(costBreakup);
            cells[target.dataset.x].innerHTML = `<span class='hid'>${data.value}</span><span>${data.text}</span><span class='hid'>${data.typeId}</span>`;
            resourcesCtrl.style.top = "-2000px";
        });
    
    // resourcesCtrl.children[0].children[0].children[1].value = null;

}


function taskCellContextMenu(e) {

    let { target } = e;
    // if (cell.cellIndex == taskGrid.TaskID && cell.parentElement.classList.contains('wps-row')) {
    //     insertResourceCtrl.classList.remove('anim-open');
    //     let x = cell.cellIndex,
    //         y = cell.parentElement.rowIndex;
    //     let column = taskTableStruc[x][0];
    //     cell.classList.add("over-cell");
    //     let struc = taskTableStruc;
    //     let tbl = taskTable;
    //     if (struc[x][0] == "TaskID") moveTaskCtrl(insertResourceCtrl, cell, x, y);
    // }
    // if (cell.cellIndex == taskGrid.add && !cell.parentElement.classList.contains("wps-row")) insertCtrl.classList.remove('anim-open');
    if (target.cellIndex == taskGrid.add) {
        insertCtrl.classList.remove('anim-open');
        insertResourceCtrl.classList.remove('anim-open');
    }
    e.preventDefault();

}

function createRow(y, taskId, dr) {
    if (getLevel(taskId) > 1) {
        let parentId = getParentTask(taskId);
        let parentTask = document.getElementById(`l-${parentId}`).cells[taskGrid.TaskID].classList;
        if (parentTask.contains("closed")) {
            document.getElementById(`l-${parentId}`).cells[taskGrid.TaskID].click();
        } else if (!parentTask.contains("open")) {
            parentTask.add("open");
        }
    }

    row = taskTable.insertRow(
        taskTable.rows.length == 1
            ? 1
            : y);
    row.tabIndex = y;
    //row.scrollIntoView();

    taskTableStruc.forEach((props, i) => {
        let d = dr[props[0]];
        let cell = row.insertCell();
        cell.classList.add("default-cell");
        cell.onclick = taskCellClick;
        cell.onmouseover = taskCellOver;
        cell.oncontextmenu = taskCellContextMenu;
        if (props[1]) {
            if (props[1] == "select") {
                cell.classList.add("unmarked-row");
                cell.classList.add("icon-col");
                cell.classList.add("icon-size");
            } else if (props[1] == "remove") {
                cell.classList.add("dustbin");
                cell.classList.add("icon-col");
                cell.classList.add("icon-size");
            } else if (props[1] == "add") {
                cell.classList.add("plus");
                cell.classList.add("icon-col");
                cell.classList.add("icon-size");
            } else if (props[1] == "branch") {
                cell.classList.add("taskId-cell");
                cell.classList.add("icon-size");
                let yu = taskId.split('.').length - 1;
                cell.classList.add(`pos${yu}`);
                setLevel(row, taskId);

            } else if (props[1] == "checkbox") {
                let status = d
                    ? "checked"
                    : "unchecked";
                cell.classList.add(status);
                cell.classList.add("checked-col");
                cell.classList.add("icon-size");
            } else if (props[1] == "date") {
                cell.classList.add("date-cell");
                cell.classList.add("icon-size");
                cell.textContent = d
                    ? d.Date2UIDate()
                    : null;
            } else if (props[1] == "dropdn") {

                cell.classList.add("icon-size");
                if (props[0] == "ProjectLocationID" && dr.WorkPackage) {
                    cell.classList.add("location-col");
                    // if (getLevel(taskId) == 1)

                    locationsCtrl.value = d;
                    cell.innerHTML = `<span class='hid'>${d}</span><span>${locationsCtrl.selectedOptions.length > 0
                        ? locationsCtrl.selectedOptions[0].text
                        : ""}</span>`;
                    //if (row.classList.contains('pr0')) 
                    cell.classList.add("dropdn");
                } else cell.classList.add("monitoring-freq-col");
                if (props[0] == "MonitoringFrequency" && dr.WorkPackage) {

                    frequenciesCtrl.value = d;
                    cell.innerHTML = `<span class='hid'>${frequenciesCtrl.value}</span><span>${frequenciesCtrl.selectedOptions.length > 0
                        ? frequenciesCtrl.selectedOptions[0].text
                        : ''}</span>`;
                    cell.classList.add("dropdn");
                }
                // else d = taskTable.rows[y - 1].cells[i].textContent;
                // cell.textContent = d;
                //  else d = taskTable.rows[y - 1].cells[i].children[0].textContent;

            } else if (props[0] == "PlannedCost") {
                cell.classList.add("value-cell");
                // cell.textContent = Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(d);//
                cell.textContent = d;//
            } else if (props[1] == "number") {
                cell.classList.add("value-cell");
                // cell.textContent = Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(d);//
                cell.textContent = d;//
            } else if (props[1] == "text") {
                cell.classList.add(`${props[0]}-cell`);
                cell.textContent = d;
            } else if (props[0] == "_id") {
                cell.classList.add(`hid`);
                cell.textContent = d;
            } else if (props[0] == "rowKey") {
                cell.classList.remove('default-cell');
                cell.classList.add(`hid`);
                cell.textContent = Date.now();
            } else if (props[0] == "child") {
                cell.classList.remove('default-cell');
                cell.classList.add(`child-row`);

            }
        }
    });
}



function cellOut(controlsClass) {
    let ctrls = document.getElementsByClassName(controlsClass);

    for (let i = 0; i < ctrls.length; i++) {
        djl.appendChild(ctrls[i]);
    }
}
function createResRow(d) {

    let check = d.Type == 'TaskPlannedResource';
    let taskId = d['TaskID'];


    row = check
        ? resTable(taskId).insertRow(-1)
        : itemTable(taskId).insertRow(-1);

    // if (d.TaskID == document.getElementsByClassName('current-row')[0].cells[taskGrid.TaskID].textContent)
    //     row.classList.add('show');
    // else
    //     row.classList.add('hid');
    //resetChild(taskId);
    // row.scrollIntoView();
    let type = d.Type == 'TaskPlannedResource'
        ? resTableStruc
        : itemTableStruc;
    type.forEach((props, i) => {
        //   let d = resRowDefaults[props[0]];
        let cell = row.insertCell();
        cell.classList.add("default-cell");
        cell.onclick = check ? resourceCellClick : boqCellClick;
        cell.onmouseover = check ? resourceCellOver : boqCellOver;
        if (props[1]) {
            if (props[1] == "select") {
                cell.classList.add("unmarked-row");
                cell.classList.add("icon-col");
                cell.classList.add("icon-size");
            } else if (props[1] == "remove") {
                cell.classList.add("dustbin");
                cell.classList.add("icon-col");
                cell.classList.add("icon-size");
            } else if (props[1] == "add_d") {
                cell.classList.add("plus");
                cell.classList.add("icon-col");
                cell.classList.add("icon-size");
            } else if (props[0] == "ResourceID") {
                cell.classList.add("resource-cell");
                cell.classList.add("icon-size");
                cell.classList.add("dropdn");
                if (d[props[0]].length > 0) {
                    cell.innerHTML = `<span class='hid'>${d[props[0]]}</span><span>${d['ResourceName']}</span><span class='hid'>${d['ResourceTypeID']}</span>`;
                } else
                    cell.innerHTML = null;
            }
            else if (props[0] == "Description") {
                cell.classList.add("description-cell");
                cell.classList.add("icon-size");
                cell.textContent = d[props[0]];

            } else if (props[1] == "dropdn") {
                cell.classList.add("icon-size");
                cell.classList.add("dropdn");
                if (props[0] == "ItemType") {
                    cell.classList.add("item-type-cell");
                    itemTypesCtrl.value = d[props[0]];
                    cell.innerHTML = `<span class='hid'>${itemTypesCtrl.value}</span><span>${itemTypesCtrl.selectedOptions.length > 0
                        ? itemTypesCtrl.selectedOptions[0].text
                        : ""}</span>`;
                };
                if (props[0] == "UOM") {
                    cell.classList.add("uom-cell");
                    uomsCtrl.value = d[props[0]];
                    cell.innerHTML = `<span class='hid'>${uomsCtrl.value}</span><span>${uomsCtrl.selectedOptions.length > 0
                        ? uomsCtrl.selectedOptions[0].text
                        : ''}</span>`;
                }

            } else if (props[1] == "number") {
                cell.classList.add("value-cell");

                if (props[0] == "Quantity" && d.Type == 'TaskPlannedResource') {
                    // let taskId = resTable().rows[costY].cells[resGrid.TaskID].textContent;
                    //       let taskId = resTable().rows[costY].cells[resGrid.TaskID].textContent;
                    let task = document.getElementById(`l-${row.cells[resGrid.TaskID].textContent}`).cells;

                    cell.textContent = businessDays(new Date(task[taskGrid.PlannedStartDate].textContent), new Date(task[taskGrid.PlannedEndDate].textContent));
                } else
                    cell.textContent = (Number(d[props[0]])).toFixed(2);

                // } else if (props[0] == "CostPerUnit") {
                //     cell.classList.add("value-cell");
                //     cell.textContent = (Number(d[props[0]])).toFixed(2);
                // } else if (props[0] == "Total") {
                //     cell.classList.add("value-col");
                //     cell.textContent = (Number(d[props[0]])).toFixed(2);
                //          cell.textContent = (Number(cell.parentElement.cells[resGrid.Quantity].textContent) * Number(cell.parentElement.cells[resGrid.CostPerUnit].textContent)).toFixed(2);
            } else if (props[0] == "TaskID") {
                cell.classList.remove('default-cell');
                cell.classList.add(`hid`);
                //  cell.classList.remove("default-cell");
                cell.textContent = d[props[0]];
            } else if (props[0] == "_id") {
                cell.classList.remove('default-cell');
                cell.classList.add(`hid`);
                cell.textContent = d[props[0]];
            } else if (props[0] == "Top3") {
                cell.classList.remove('default-cell');
                cell.classList.add(`hid`);
                cell.textContent = d[props[0]];

            } else if (props[0] == "rowKey") {
                cell.classList.remove('default-cell');
                cell.classList.add(`hid`);
                cell.textContent = document.getElementById(`l-${taskId}`).cells[taskGrid.rowKey].textContent;
            }

        }
    });
}

function getTasks(taskId) {
    let len = taskId.length;
    let taskIds = [];
    let id = "";
    for (let i = 0; i < len; i++) {
        if (i == len - 1) {
            taskIds.push(id + taskId[i]);
        } else if (taskId[i] != ".")
            id += taskId[i];
        else {
            taskIds.push(id);
            id += taskId[i];
        }
    }
    return taskIds;
}

function getParentTask(taskId) {
    let taskIds = taskId.split(".");
    let len = taskIds.length;
    return taskIds.reduce((a, v, i) => {
        return i < len - 2
            ? a + (v + ".")
            : i < len - 1
                ? a + v
                : a;
    }, "");
}

function resetCurrentRow(taskId) {
    clearCurrentRow();

    openChild(taskId);
}

function resetChild(taskId) {
    // let taskId = taskTable.rows[costY].cells[taskGrid.TaskID].textContent;
    let currChild = tableChilds['T-' + taskId];
    if (currChild) {
        let resDiv = currChild.querySelector('.res-div');
        let boqDiv = currChild.querySelector('.boq-div');


        if (resTable(taskId).rows.length > 0) resDiv.classList.toggle('showChild');
        if (itemTable(taskId).rows.length > 0) boqDiv.classList.toggle('showChild');
    }
    // if (resTable(taskId).rows.length > 0) {
    //     if (!resDiv.classList.contains('showChild')) {
    //         resDiv.classList.add('showChild');
    //         resDiv.classList.remove('hidChild');
    //     } else {
    //         resDiv.classList.add('hidChild');
    //         resDiv.classList.remove('showChild');
    //     }
    // }
    // if (itemTable(taskId).rows.length > 0) {
    //     if (!boqDiv.classList.contains('showChild')) {
    //         boqDiv.classList.add('showChild');
    //         boqDiv.classList.remove('hidChild');
    //     } else {
    //         boqDiv.classList.add('hidChild');
    //         boqDiv.classList.remove('showChild');
    //     }
    // }


    // if (document.querySelectorAll('.res-div .show').length > 0) document.getElementsByClassName('res-div')[0].classList.remove('hid');
    // else document.getElementsByClassName('res-div')[0].classList.add('hid');
    // if (document.querySelectorAll('.boq-div .show').length > 0) document.getElementsByClassName('boq-div')[0].classList.remove('hid');
    // else document.getElementsByClassName('boq-div')[0].classList.add('hid');
}
function openChild(taskId) {
    let currChild = tableChilds['T-' + taskId];
    if (currChild) {
        let resDiv = currChild.querySelector('.res-div');
        let boqDiv = currChild.querySelector('.boq-div');
        if (resTable(taskId).rows.length > 0) resDiv.classList.add('showChild');
        if (itemTable(taskId).rows.length > 0) boqDiv.classList.add('showChild');
    }
}
function resetResources(taskId, newTaskId, rowKey) {
    let xi = 0;
    let rows = resTable(taskId).rows;
    while (xi < rows.length) {
        if (rows[xi].cells[resGrid.TaskID].textContent == taskId && rows[xi].cells[resGrid.rowKey].textContent == rowKey)
            rows[xi].cells[resGrid.TaskID].textContent = newTaskId;
        xi++;
    }
    xi = 0;


    rows = itemTable(taskId).rows;
    while (xi < rows.length) {
        if (rows[xi].cells[itemGrid.TaskID].textContent == taskId && rows[xi].cells[itemGrid.rowKey].textContent == rowKey)
            rows[xi].cells[itemGrid.TaskID].textContent = newTaskId;
        xi++;
    }

}

function taskCellClick({ currentTarget: lastCell }) {

    let x = lastCell.cellIndex,
        y = lastCell.parentElement.rowIndex;
    costY = y;
    let column = taskTableStruc[x][0];
    if (column == "Milestone" || column == "CriticalPath") resetCellClass(["unchecked", "checked"], lastCell);
    else if (column == "select") resetCellClass(["unmarked-row", "marked-row"], lastCell);
    else if (column == "TaskDescription") moveTaskCtrl(taskDescriptionCtrl, lastCell, x, y);
    // else if (column == "remove") moveTaskCtrl(removeTaskCtrl, lastCell, x, y);
    // else if (column == "remove") {
    //     onInputRemoveTask({ target: { dataset: { y: y} } });
    // }

    else if (column == "TaskID") {
        let isWpsRow = lastCell.parentElement.classList.contains('wps-row');
        if (isWpsRow) {
            resetChild(lastCell.textContent);
            insertResourceCtrl.classList.remove('anim-open');
        }
        if (lastCell.classList.contains("open")) {
            lastCell.classList.remove("open");
            lastCell.classList.add("closed");
            toggleChilds(document.getElementsByClassName(`pr${lastCell.textContent}`), 'open');
        } else if (lastCell.classList.contains("closed")) {
            lastCell.classList.add("open");
            lastCell.classList.remove("closed");
            toggleChilds(document.getElementsByClassName(`pr${lastCell.textContent}`), 'closed');
        }
    } else if (column == "add") {
        lastCell.classList.add("over-cell");
        insertResourceCtrl.classList.remove('anim-open');
        insertCtrl.classList.remove('anim-open');
        if (!lastCell.parentElement.classList.contains("wps-row")) {
            moveTaskCtrl(insertCtrl, lastCell, x, y);
        }
        else {
            moveTaskCtrl(insertResourceCtrl, lastCell, x, y);
        }
    }
    else if (column == "PlannedStartDate" && lastCell.parentElement.classList.contains('wps-row')) moveTaskCtrl(startDateCtrl, lastCell, x, y);
    else if (column == "PlannedEndDate" && lastCell.parentElement.classList.contains('wps-row')) moveTaskCtrl(endDateCtrl, lastCell, x, y);

}

function resourceCellClick({ currentTarget: lastCell }) {
    let x = lastCell.cellIndex,
        y = lastCell.parentElement.rowIndex;
    let taskId = lastCell.parentElement.cells[resGrid.TaskID].textContent;
    column = resTableStruc[x][0];
    if (column == "select") resetCellClass(["unmarked-row", "marked-row"], lastCell);
    else if (column == "Description") moveResourceCtrl(resourceDescriptionCtrl, lastCell, x, y);
    // else if (column == "remove") moveResourceCtrl(removeResourceCtrl, lastCell, x, y);
    else if (column == "remove") {
        onInputRemoveResource({ target: { dataset: { g: 'resources-table', y: y, taskId: taskId } } });
    }
    else if (column == "add_d") {
        let table = resTable(taskId);
        let total = table.rows.length == 0 ? 1 : Number(table.rows[table.rows.length - 1].cells[resGrid.Total].textContent);
        if (total != 0) {
            resRowDefaults.TaskID = taskId;
            createResRow(resRowDefaults);
        }
    } else if (column == "CostPerUnit") {
        moveResourceCtrl(resourceCostCtrl, lastCell, x, y);
        resourceCostCtrl.select();
    } else if (column == "ResourceID") {
        moveResourceCtrl(resourcesCtrl, lastCell, x, y);
    }
}
function getPosition(el) {
    var xPos = 0;
    var yPos = 0;

    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return {
        x: xPos,
        y: yPos
    };
}

function boqCellClick({ currentTarget: lastCell }) {
    let x = lastCell.cellIndex,
        y = lastCell.parentElement.rowIndex;
    let taskId = lastCell.parentElement.cells[resGrid.TaskID].textContent;
    column = itemTableStruc[x][0];
    if (column == "select") resetCellClass(["unmarked-row", "marked-row"], lastCell);
    else if (column == "Description") moveBOQCtrl(boqDescriptionCtrl, lastCell, x, y);
    // else if (column == "remove") moveBOQCtrl(removeBoqCtrl, lastCell, x, y);
    else if (column == "remove") {

        onInputRemoveBOQ({ target: { dataset: { g: 'resources-table-boq', y: y, taskId: taskId } } });

    }

    else if (column == "add_d") {


        let table = itemTable(taskId);
        let total = table.rows.length == 0 ? 1 : Number(table.rows[table.rows.length - 1].cells[itemGrid.Total].textContent);
        if (total != 0) {
            itemRowDefaults.TaskID = taskId;
            createResRow(itemRowDefaults);
        }




    } else if (column == "CostPerUnit") {
        moveBOQCtrl(boqCostCtrl, lastCell, x, y);
        boqCostCtrl.select();
    } else if (column == "Quantity") {
        moveBOQCtrl(boqQuantityCtrl, lastCell, x, y);
        boqQuantityCtrl.select();
    }
}

function toggleChilds(childs, status) {
    if (childs.length > 0) {
        Array.from(childs).forEach((child) => {

            if (status == "open") {

                child.classList.add('closed-row');

                if (child.cells[taskGrid.TaskID].classList.contains("open")) {
                    toggleChilds(document.getElementsByClassName(`pr${child.cells[taskGrid.TaskID].textContent}`), status);
                }
                // if(child.classList.contains('work-package') && !child.cells[taskGrid.TaskID].classList.contains("closed-row")) 

                //     child.cells[taskGrid.TaskID].classList.add("open");
                // }
            } else {
                //  child.classList.add('open-row');
                child.classList.remove('closed-row');
                if (child.cells[taskGrid.TaskID].classList.contains("open")) {
                    toggleChilds(document.getElementsByClassName(`pr${child.cells[taskGrid.TaskID].textContent}`), status);
                }
                // if (child.cells[taskGrid.TaskID].classList.contains("open")) {
                //     child.cells[taskGrid.TaskID].classList.remove("open");
                //     child.cells[taskGrid.TaskID].classList.add("closed");
                // }
            }


        });

    }
}

function resetCellClass(classes, cell) {
    cell.classList.toggle(classes[0]);
    cell.classList.toggle(classes[1]);
}


function moveTaskCtrl(ctrl, currentCell, x, y) {
    currentCell.parentElement.parentElement.parentElement.parentElement.appendChild(ctrl);
    if (lastCtrl) setStyles(lastCtrl);
    lastCtrl = ctrl;
    if (ctrl.id == "start-date") ctrl.value = currentCell.textContent.UIDate2CtrlDate();
    else if (ctrl.id == "end-date") ctrl.value = currentCell.textContent.UIDate2CtrlDate();
    else ctrl.value = currentCell.textContent;
    ctrl.style.left = currentCell.offsetLeft + 1 + 'px';
    if (ctrl.id == 'insertResource' || ctrl.id == 'insert') {
        ctrl.style.top = `${currentCell.offsetTop + currentCell.offsetHeight}px`;
        //  ctrl.scrollIntoView();
        ctrl.classList.add('anim-open');
    }
    else {
        ctrl.style.height = currentCell.offsetHeight + `px`;
        // ctrl.style.height = currentCell.offsetHeight - 4 + `px`;
        ctrl.style.top = `${currentCell.offsetTop}px`;
        ctrl.style.width = currentCell.offsetWidth + `px`;
    }
    ctrl.dataset.y = y;
    ctrl.dataset.x = x;
    ctrl.dataset.task = currentCell.parentElement.cells[taskGrid.TaskID].textContent;
    ctrl.dataset.g = "table";

    if (ctrl.type == 'select-one')
        ctrl.value = currentCell.value;
    ctrl.focus();

}

// function myFunction(e){
//     resourcesCtrl.style.top   =  '-1000px';
// }

const setStyles = ctrl => ctrl.style.top = '-1000px';

function hideCtrl(e) {
    taskControls.forEach(setStyles);
    resourceControls.forEach(setStyles);
    boqControls.forEach(setStyles);
}


function moveResourceCtrl(ctrl, currentCell, x, y) {
    let div = currentCell.parentElement.parentElement.parentElement.parentElement;
    if (lastCtrl) setStyles(lastCtrl);
    lastCtrl = ctrl;
    div.appendChild(ctrl);
    if (ctrl.resetMutations) {
        let isEmpty = currentCell.children.length == 0 || currentCell.children[0].textContent.length == 0;

        ctrl.resetMutations(isEmpty ? [null, null] : [currentCell.children[0].textContent, currentCell.children[1].textContent]);
    }
    if (ctrl.id == "CostPerUnit") ctrl.value = Number(currentCell.textContent).toFixed(2);
    else ctrl.value = currentCell.textContent;
    ctrl.style.left = currentCell.offsetLeft - 1 + 'px';
    ctrl.style.top = `${currentCell.offsetTop - div.scrollTop}px`;
    ctrl.style.width = currentCell.offsetWidth + `px`;
    ctrl.style.height = currentCell.offsetHeight + `px`;
    ctrl.dataset.y = y;
    ctrl.dataset.x = x;
    ctrl.dataset.task = currentCell.parentElement.cells[resGrid.TaskID].textContent;
    ctrl.dataset.g = "resources-table";
    if (ctrl.type == 'select-one')
        ctrl.value = currentCell.value;
    ctrl.focus();
}

function moveBOQCtrl(ctrl, currentCell, x, y) {
    let div = currentCell.parentElement.parentElement.parentElement.parentElement;
    if (lastCtrl) setStyles(lastCtrl);
    lastCtrl = ctrl;
    div.appendChild(ctrl);
    if (ctrl.id == "CostPerUnit") ctrl.value = Number(currentCell.textContent).toFixed(2);
    else if (ctrl.id == "Quanity") ctrl.value = Number(currentCell.textContent).toFixed(2);
    else ctrl.value = currentCell.textContent;
    ctrl.style.left = currentCell.offsetLeft + 'px';
    ctrl.style.top = `${currentCell.offsetTop}px`;
    ctrl.style.width = currentCell.offsetWidth + `px`;
    ctrl.style.height = currentCell.offsetHeight + `px`;
    // ctrl.style.height = currentCell.offsetHeight - 6 + `px`;
    ctrl.dataset.y = y;
    ctrl.dataset.x = x;
    ctrl.dataset.task = currentCell.parentElement.cells[itemGrid.TaskID].textContent;
    ctrl.dataset.g = "resources-table-boq";
    if (ctrl.type == 'select-one')
        ctrl.value = currentCell.value;
    ctrl.focus();
}

function taskCellOver({ currentTarget: cell }) {
    cell.onmouseover = null;

    cell.classList.add("over-cell");
    let x = cell.cellIndex,
        y = cell.parentElement.rowIndex;
    let struc = taskTableStruc;
    let tbl = taskTable;
    if (struc[x][1] == "dropdn" && struc[x][0] == "ProjectLocationID") {
        // if (getLevel(tbl.rows[y].cells[taskGrid.TaskID].textContent) == 1)
        if (cell.parentElement.classList.contains("wps-row"))
            moveTaskCtrl(locationsCtrl, cell, x, y);
    }
    else if (struc[x][1] == "dropdn" && struc[x][0] == "MonitoringFrequency") {
        if (cell.parentElement.classList.contains("wps-row"))
            moveTaskCtrl(frequenciesCtrl, cell, x, y);
    }
    else if (struc[x][1] == "remove") {
        //moveTaskCtrl(removeTaskCtrl, cell, x, y);
    }
    cell.onmouseover = taskCellOver;

}
function resourceCellOver({ currentTarget: cell }) {
    cell.onmouseover = null;
    cell.classList.add("over-cell");
    let x = cell.cellIndex,
        y = cell.parentElement.rowIndex;
    struc = resTableStruc;
    // if (struc[x][1] == "remove") {
    //     moveResourceCtrl(removeResourceCtrl, cell, x, y);
    // }
    cell.onmouseover = resourceCellOver;
}

function boqCellOver({ currentTarget: cell }) {
    cell.onmouseover = null;
    cell.classList.add("over-cell");
    let x = cell.cellIndex,
        y = cell.parentElement.rowIndex;
    struc = itemTableStruc;
    if (struc[x][1] == "dropdn" && struc[x][0] == "ItemType") {
        moveBOQCtrl(itemTypesCtrl, cell, x, y);
    } else if (struc[x][1] == "dropdn" && struc[x][0] == "UOM") {
        let validUOMS = [], itemType = cell.parentElement.cells[itemGrid.ItemType].children[1].textContent;
        console.log(itemType);
        if (itemType == 'Labour') {
            validUOMS = [7, 9];
        } else if (itemType == 'Job') {
            validUOMS = [1, 2, 3, 4, 5, 6, 11];
        } else if (itemType == 'Contractor’s Equipment') {
            validUOMS = [7, 9];
        } else if (itemType == 'Consumable Material') {
            validUOMS = [1, 8, 10, 12, 13, 14, 15, 16];
        }

        Array.from(uomsCtrl.options).forEach(option => {
            if (validUOMS.includes(Number(option.value))) {
                option.classList.remove('hid');
            }
            else option.classList.add('hid');

        });
        moveBOQCtrl(uomsCtrl, cell, x, y);



        // } else if (struc[x][1] == "remove") {
        //     moveBOQCtrl(removeBoqCtrl, cell, x, y);
    }
    cell.onmouseover = boqCellOver;
}

$('#btnWBSSave').click(function (e) {
    persist('OPEN');
});

$('#btnWBSLock').click(function (e) {
    persist('PLANNED');
});

function persist(status) {

    let data = [
        {
            _id: '',
            ProjectID: projectId,
            TaskID: '0',
            ParentID: '',
            TaskDescription: projectName || 'Project',
            // PlannedStartDate: head.cells[0].textContent || new Date(head.cells[0].textContent),
            // PlannedEndDate: head.cells[1].textContent || new Date(head.cells[1].textContent),
            PlannedStartDate: head.cells[0].textContent.UIDate2CtrlDate(),
            PlannedEndDate: head.cells[1].textContent.UIDate2CtrlDate(),
            WorkPackage: false,
            MonitoringFrequency: '',
            PlannedCost: head.cells[2].textContent.toNumber(),
            Weightage: 1,
            ProjectLocationID: '',
            Milestone: false,
            CriticalPath: false
        }
    ],
        dataRes = [], dataItem = [];
    var totalEstimatedBudget = data[0].PlannedCost;
    Array.from(taskTable.rows).forEach((row, i) => {
        if (i > 0) {
            data.push({
                _id: row.cells[taskGrid._id].textContent,
                ProjectID: projectId,
                TaskID: row.cells[taskGrid.TaskID].textContent,
                ParentID: getParentTask(row.cells[taskGrid.TaskID].textContent),
                TaskDescription: row.cells[taskGrid.TaskDescription].textContent,
                // PlannedStartDate: row.cells[taskGrid.PlannedStartDate].textContent || new Date(row.cells[taskGrid.PlannedStartDate].textContent),
                // PlannedEndDate: row.cells[taskGrid.PlannedEndDate].textContent || new Date(row.cells[taskGrid.PlannedEndDate].textContent),
                PlannedStartDate: row.cells[taskGrid.PlannedStartDate].textContent.UIDate2CtrlDate(),
                PlannedEndDate: row.cells[taskGrid.PlannedEndDate].textContent.UIDate2CtrlDate(),
                WorkPackage: row.classList.contains('wps-row'),
                MonitoringFrequency: row.cells[taskGrid.MonitoringFrequency].children.length > 0
                    ? row.cells[taskGrid.MonitoringFrequency].children[0].textContent
                    : '',
                PlannedCost: row.cells[taskGrid.PlannedCost].textContent.toNumber(),
                Weightage: row.cells[taskGrid.PlannedCost].textContent.toNumber() / totalEstimatedBudget,
                ProjectLocationID: row.classList.contains('wps-row') ? row.cells[taskGrid.ProjectLocationID].children[0].textContent : null,
                Milestone: row.cells[taskGrid.Milestone].classList.contains('checked'),
                CriticalPath: row.cells[taskGrid.CriticalPath].classList.contains('checked')
            });
        }

    });
    let row;
    for (div in tableChilds) {
        let table = tableChilds[div].querySelector('.resources-table').rows;
        for (let i = 0; i < table.length; i++) {
            row = table[i];
            let taskId = div.split('-')[1];
            let task = document.getElementById(`l-${taskId}`).cells;
            let resourceId = row.cells[resGrid.ResourceID].children[0].textContent;
            dataRes.push({
                _id: row.cells[resGrid._id].textContent,
                ProjectID: projectId,
                TaskID: taskId,
                ResourceID: row.cells[resGrid.ResourceID].children[0].textContent,
                ResourceTypeID: row.cells[resGrid.ResourceID].children[2].textContent,
                PlannedStartDate: task[taskGrid.PlannedStartDate].textContent.UIDate2CtrlDate(),
                Description: row.cells[resGrid.Description].textContent,
                PlannedEndDate: task[taskGrid.PlannedEndDate].textContent.UIDate2CtrlDate(),
                ProjectLocationID: task[taskGrid.ProjectLocationID].children[0].textContent,
                Quantity: Number(row.cells[resGrid.Quantity].textContent),
                CostPerUnit: row.cells[resGrid.CostPerUnit].textContent.toNumber(),
                Total: row.cells[resGrid.Total].textContent.toNumber()
            });
        }

        table = tableChilds[div].querySelector('.resources-table-boq').rows;
        for (let i = 0; i < table.length; i++) {
            row = table[i];
            let taskId = div.split('-')[1];
            let task = document.getElementById(`l-${taskId}`).cells;
            dataItem.push({
                _id: row.cells[itemGrid._id].textContent,
                ProjectID: projectId,
                TaskID: taskId,
                Description: row.cells[itemGrid.Description].textContent,
                ItemType: row.cells[itemGrid.ItemType].children[0].textContent,
                UOM: row.cells[itemGrid.UOM].children[0].textContent,
                Top3: row.cells[itemGrid.Top3].textContent,
                Quantity: Number(row.cells[itemGrid.Quantity].textContent),
                CostPerUnit: row.cells[itemGrid.CostPerUnit].textContent.toNumber(),
                Total: row.cells[itemGrid.Total].textContent.toNumber()
            });

        }
    }

    $.ajax({
        url: '/tasks/wbs',
        type: 'POST',
        data: JSON.stringify({ plannedResources: dataRes, plannedTasks: data, totalEstimatedBudget, plannedBOQ: dataItem, status }),
        contentType: "application/json",
        success: function (data) {
            document.cookie = "projectStatus=" + status + ";path=/";
            $('body').pgNotification({
                style: 'flip',
                message: "Saved",
                position: 'top-right',
                type: 'danger',
                showClose: true,
                timeout: 3000
            }).show();
            setTimeout(()=>window.location ='/projects',1000);
        },
        error: function (data) {
            $('body').pgNotification({
                style: 'flip',
                message: data.responseJSON.error,
                position: 'top-right',
                type: 'danger',
                showClose: true,
                timeout: 3000
            }).show();
        }
    });

}







function isEmpty(cell) {
    if (cell.textContent.length == 0) {
        //    if(cell.classList.contains('location-col')) document.getElementById(`l-${cell.parentElement.classList[0].split('.')[0].split('pr')[1]}`).cells[taskGrid.ProjectLocationID].classList.add(taskTableStruc[taskGrid.ProjectLocationID][2]);

        //     else
        cell.classList.add(taskTableStruc[cell.cellIndex][2]);
        return true;
    }
    cell.classList.remove(taskTableStruc[cell.cellIndex][2]);
    return false;
}
