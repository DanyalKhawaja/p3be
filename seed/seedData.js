const mongoose = require('mongoose');
const User = require('../models/userModel');
const ProjectType = require("../models/projectTypeModel");
const Role = require("../models/roleModel");
const Company = require("../models/companyModel");
const Subsription = require("../models/subscriptionModel");
const Page = require("../models/pageModel");
const Currency = require("../models/currencyModel");

const bcryptjs = require('bcryptjs');

const currencies = [{_id: "usd", name: "US Dollar"}, {_id: "pkr", name: "Pakistani Rupee"}];

const menuOptions = [
    {
        path: "/portfolios",
        route: "",
        description: "Portfolios",
        order: 1,
        disabled: false,
        roles: ['PROJMGR', 'PROGMGR', 'PORTMGR']
    },
    {
        path: "/programs",
        route: "",
        description: "Programs",
        order: 2,
        disabled: false,
        roles: ['PROJMGR', 'PROGMGR']
    },
    {
        path: "/projects",
        route: "",
        description: "Projects",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/dashboard",
        route: "/projects",
        description: "Dashboard",
        icon: "dashboard",
        order: 2,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/gis",
        route: "/dashboard",
        description: "GIS",
        icon: "map",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/evm",
        route: "/dashboard",
        description: "EVM",
        icon: "analytics",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/forecast",
        route: "/dashboard",
        description: "Forecast",
        icon: "trending_up",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    }, {
        path: "/kpis",
        route: "/dashboard",
        description: "KPIs",
        icon: "speed",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    }, {
        path: "/wpm",
        route: "/projects",
        description: "WPM",
        icon: "remove_red_eye",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    }, {
        path: "/var_graph",
        route: "/wpm",
        description: "Variance",
        icon: "manage_search",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/wpm",
        route: "/wpm",
        description: "Snapshot View",
        icon: "remove_red_eye",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/monthwise_variance",
        route: "/projects",
        description: "Monthwise Variance",
        icon: "calendar_view_week",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/monthly_labor_rate",
        route: "/monthwise_variance",
        description: "Monthly Labor Rate",
        icon: "request_page",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/monthly_labor_efficiency",
        route: "/monthwise_variance",
        description: "Monthly Labor Efficiency",
        icon: "bolt",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/wbs",
        route: "/projects",
        description: "WBS",
        icon: "account_tree",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/wbs",
        route: "/wbs",
        description: "Edit",
        icon: "create",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/gantt_chart",
        route: "/wbs",
        description: "Gantt Chart",
        icon: "access_time",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/hierarchy",
        route: "/wbs",
        description: "Hierarchy",
        icon: "park",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/task",
        route: "/projects",
        description: "Tasks",
        icon: "task",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/status",
        route: "/task",
        description: "Status",
        icon: "quiz",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/due",
        route: "/task",
        description: "Execution Due",
        icon: "upcoming",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/monitoring",
        route: "/task",
        description: "Monitoring",
        icon: "adjust",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/history",
        route: "/task",
        description: "Monitoring History",
        icon: "history_edu",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/resource_allocation",
        route: "/projects",
        description: "Resource Allocation",
        icon: "engineering",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/project_resource_type",
        route: "/resource_allocation",
        description: "Project's Resource Type",
        icon: "perm_contact_calendar",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/resource_schedule",
        route: "/resource_allocation",
        description: "Resource Schedule",
        icon: "perm_contact_calendar",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/resource_allocations",
        route: "/resource_allocation",
        description: "Project's Resources",
        icon: "perm_contact_calendar",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/misc",
        route: "/projects",
        description: "Miscellaneous",
        icon: "line_style",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/riskregister",
        route: "/misc",
        description: "Risk Register",
        icon: "coronavirus",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/issuelog",
        route: "/misc",
        description: "Issue Log",
        icon: "report_problem",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/procurements",
        route: "/misc",
        description: "Procurements",
        icon: "local_grocery_store",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/lessonslearned",
        route: "/misc",
        description: "Lessons Learned",
        icon: "auto_stories",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/stakeholders",
        route: "/misc",
        description: "Stake Holdeers",
        icon: "supervised_user_circle",
        order: 3,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/dashboard",
        route: "/portfolios",
        description: "Dashboard",
        icon: "",
        order: 1,
        disabled: false,
        roles: ['PROJMGR', 'PROGMGR','PORTMGR']
    },
    {
        path: "/scenario_analysis",
        route: "/portfolios",
        description: "Scenario Analysis",
        icon: "",
        order: 1,
        disabled: false,
        roles: ['PROJMGR', 'PROGMGR','PORTMGR']
    },
    {
        path: "/scenarioanalysis",
        route: "/scenario_analysis",
        description: "Scenario Analysis",
        icon: "",
        order: 1,
        disabled: false,
        roles: ['PROJMGR', 'PROGMGR','PORTMGR']
    },
    {
        path: "/portfolios",
        route: "/scenario_analysis",
        description: "Portfolios",
        icon: "",
        order: 1,
        disabled: false,
        roles: ['PROJMGR', 'PROGMGR','PORTMGR']
    },
    {
        path: "/programs",
        route: "/scenario_analysis",
        description: "Portfolios",
        icon: "",
        order: 1,
        disabled: false,
        roles: ['PROJMGR','PROGMGR', 'PORTMGR']
    }, {
        path: "/projects",
        route: "/scenario_analysis",
        description: "Portfolios",
        icon: "",
        order: 1,
        disabled: false,
        roles: ['PROJMGR', 'PROGMGR','PORTMGR']
    },
    {
        path: "/admin",
        route: "",
        description: "Admin",
        icon: "",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/master_lists",
        route: "/admin",
        description: "Master Lists",
        icon: "view_list",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/users",
        route: "/master_lists",
        description: "Users",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/riskstatus",
        route: "/master_lists",
        description: "Risk Status",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/roles",
        route: "/master_lists",
        description: "Roles",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/departments",
        route: "/master_lists",
        description: "Departments",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/resourceTypes",
        route: "/master_lists",
        description: "Resource Types",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/projectTypes",
        route: "/master_lists",
        description: "Project Types",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/issueTypes",
        route: "/master_lists",
        description: "Issue Types",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/issueCategories",
        route: "/master_lists",
        description: "Issue Categories",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/issueStatus",
        route: "/master_lists",
        description: "Issue Status",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/lessonsLearnedTypes",
        route: "/master_lists",
        description: "Lessons Learned Types",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/stakeholderRoles",
        route: "/master_lists",
        description: "Stakeholder Roles",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/benefitsNature",
        route: "/master_lists",
        description: "Benefits Nature",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    },
    {
        path: "/boqs",
        route: "/master_lists",
        description: "BOQ's",
        icon: "toc",
        order: 1,
        disabled: false,
        roles: ['PROJMGR']
    }
];

const roles = [{
    _id: "PROJMGR",
    name: "Project Manager"
}, {
    _id: "PROGMGR",
    name: "Program Manager"
}, {
    _id: "PORTMGR",
    name: "Portfolio Manager"
}];

const projectTypes = [{
    _id: "CONSTRUCTION",
    description: "Construction"
}];

const companies = [{
    name: "Cyberstate Inc"
}]


const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/p3', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Clear existing data (optional)
        await Page.deleteMany({});
        await User.deleteMany({});
        await Company.deleteMany({});
        await ProjectType.deleteMany({});
        await Role.deleteMany({});
        await Currency.deleteMany({});
        console.log('Cleared existing udata');

        // Insert seed data
        await ProjectType.insertMany(projectTypes);
        await Currency.insertMany(currencies);
        await Page.insertMany(menuOptions);
        const createdRoles = await Role.insertMany(roles);
        const createdCompanies = await Company.insertMany(companies);

        const subscriptions = [{
            company: createdCompanies[0]._id,
            type: "Unlimited"
        }];

        const users = [
            {
                email: "danyal_saleem@hotmail.com",
                username: "farhan",
                password: "123",
                companyId: createdCompanies[0]._id,
                role: createdRoles[0]._id,
                isVerified: true
            }
        ];


        console.log(users)

        await new Promise((res) => {
            bcryptjs.genSalt(10, (err, salt) => {
                bcryptjs.hash(users[0].password, salt, (err, hash) => {
                    users[0].password = hash;
                    res();
                });
            });
        })


        await User.insertMany(users);

        await Subsription.insertMany(subscriptions);

        console.log("created seed data")

        // Disconnect
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;