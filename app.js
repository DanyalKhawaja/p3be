const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require('passport');

const cors = require('cors');

const databaseConfig = require("./config/database");
const indexRouter = require("./routes/index");
const userRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const projectTypeRoutes = require('./routes/projectTypeRoutes')
const resourceTypeRoutes = require('./routes/resourceTypeRoutes')
const resourceRoutes = require('./routes/resourceRoutes')
const portfolioRoutes = require('./routes/portfolioRoutes');
const programRoutes = require('./routes/programRoutes');
const projectRoutes = require('./routes/projectRoutes')
const projectResourceRoutes = require('./routes/projectResourceRoutes')
const projectLocationRoutes = require('./routes/projectLocationRoutes')
const issueTypeRoutes = require('./routes/issueTypeRoutes')
const issueCategoryRoutes = require('./routes/issueCategoryRoutes')
const issueStatusRoutes = require('./routes/issueStatusRoutes')
// const issueInitiationLogRoutes = require('./routes/issueInitiationLogRoutes')
// const issueResolutionLogRoutes = require('./routes/issueResolutionLogRoutes')
// const issueUpdateRoutes = require('./routes/issueUpdateRoutes')
const issueLogRoutes = require('./routes/issueLogRoutes')
const taskRoutes = require('./routes/taskRoutes')
const taskPlannedResourceRoutes = require('./routes/taskPlannedResourceRoutes')
const taskResourceUtilizedRoutes = require('./routes/taskResourceUtilizedRoutes')
const monitoringRoutes = require('./routes/monitoringRoutes')
const monitoringImageRoutes = require('./routes/monitoringImageRoutes')
const taskChangeRequestRoutes = require('./routes/taskChangeRequestRoutes')
const resourceChangeRequestRoutes = require('./routes/resourceChangeRequestRoutes')
const riskRegisterRoutes = require('./routes/riskRegisterRoutes')
const riskStatusRoutes = require('./routes/riskStatusRoutes')
const lessonLearnedTypeRoutes = require('./routes/lessonLearnedTypeRoutes')
const lessonLearnedRoutes = require('./routes/lessonLearnedRoutes')
const procurementRoutes = require('./routes/procurementRoutes')
const procurementDeliverableRoutes = require('./routes/procurementDeliverableRoutes')
const programComponentRoutes = require('./routes/programComponentRoutes')
const componentMilestoneRoutes = require('./routes/componentMilestoneRoutes')
const programBenefitRoutes = require('./routes/programBenefitRoutes')
const programBenefitMonitoringRoutes = require('./routes/programBenefitMonitoringRoutes')
const programStakeholderRoutes = require('./routes/programStakeholderRoutes')
const stakeholderRoleRoutes = require('./routes/stakeholderRoleRoutes')
const benefitsNatureRoutes = require('./routes/benefitsNatureRoutes')
const pptRoutes = require('./routes/pptRoutes')

mongoose
  .connect(databaseConfig.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("DB server connect"))
  .catch(e => console.log("DB error", e));

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Passport middleware added by fazila mehtab
app.use(morgan("combined"));
app.use(passport.initialize());
app.use(passport.session());

require('./lib/passport');

app.use("/", indexRouter);
app.use("/", authRoutes);
app.use("/user", passport.authenticate('jwt', { session: false }), userRoutes);
app.use("/department", passport.authenticate('jwt', { session: false }), departmentRoutes);
app.use('/role', passport.authenticate('jwt', { session: false }), roleRoutes);
app.use("/projecttype", passport.authenticate('jwt', { session: false }), projectTypeRoutes);
app.use("/resourcetype", passport.authenticate('jwt', { session: false }), resourceTypeRoutes);
app.use("/resource", passport.authenticate('jwt', { session: false }), resourceRoutes)
app.use('/portfolio', passport.authenticate('jwt', { session: false }), portfolioRoutes)
app.use('/program', passport.authenticate('jwt', { session: false }), programRoutes)
app.use('/project', passport.authenticate('jwt', { session: false }), projectRoutes)
app.use('/projectResource', passport.authenticate('jwt', { session: false }), projectResourceRoutes)
app.use('/projectLocation', passport.authenticate('jwt', { session: false }), projectLocationRoutes)
app.use("/issuetype", passport.authenticate('jwt', { session: false }), issueTypeRoutes)
app.use("/issuecategory", passport.authenticate('jwt', { session: false }), issueCategoryRoutes)
app.use("/issuestatus", passport.authenticate('jwt', { session: false }), issueStatusRoutes)
app.use("/issueLog", passport.authenticate('jwt', { session: false }), issueLogRoutes)
// app.use("/issueLog", passport.authenticate('jwt', { session: false }), issueResolutionLogRoutes)
// app.use("/issueLog", passport.authenticate('jwt', { session: false }), issueUpdateRoutes)
app.use("/task", passport.authenticate('jwt', { session: false }), taskRoutes)
app.use("/tpr", passport.authenticate('jwt', { session: false }), taskPlannedResourceRoutes)
app.use("/tru", passport.authenticate('jwt', { session: false }), taskResourceUtilizedRoutes)
app.use("/monitoring", passport.authenticate('jwt', { session: false }), monitoringRoutes)
app.use("/monitoringImage", passport.authenticate('jwt', { session: false }), monitoringImageRoutes)
app.use("/tcr", passport.authenticate('jwt', { session: false }), taskChangeRequestRoutes)
app.use("/trcr", passport.authenticate('jwt', { session: false }), resourceChangeRequestRoutes)
app.use("/riskRegister", passport.authenticate('jwt', { session: false }), riskRegisterRoutes)
app.use("/riskStatus", passport.authenticate('jwt', { session: false }), riskStatusRoutes)
app.use("/lessonLearnedType", passport.authenticate('jwt', { session: false }), lessonLearnedTypeRoutes)
app.use("/lessonLearned", passport.authenticate('jwt', { session: false }), lessonLearnedRoutes)
app.use("/procurement", passport.authenticate('jwt', { session: false }), procurementRoutes)
app.use("/procurement/deliverable", passport.authenticate('jwt', { session: false }), procurementDeliverableRoutes)
app.use("/program/component", passport.authenticate('jwt', { session: false }), programComponentRoutes)
app.use("/program/component/milestone", passport.authenticate('jwt', { session: false }), componentMilestoneRoutes)
app.use("/program/benefit", passport.authenticate('jwt', { session: false }), programBenefitRoutes)
app.use("/program/benefit/monitoring", passport.authenticate('jwt', { session: false }), programBenefitMonitoringRoutes)
app.use("/program/stakeholder", passport.authenticate('jwt', { session: false }), programStakeholderRoutes)
app.use("/stakeholderrole", passport.authenticate('jwt', { session: false }), stakeholderRoleRoutes)
app.use("/benefitsnature", passport.authenticate('jwt', { session: false }), benefitsNatureRoutes)
app.use("/ppt", passport.authenticate('jwt', { session: false }), pptRoutes)


module.exports = app;
