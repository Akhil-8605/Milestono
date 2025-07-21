const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.post('/project', projectController.upload.array('images'), projectController.addProject);
router.get("/projects", projectController.getAllProjects);
router.get("/my-project", projectController.getMyProjects);
router.put("/project/:id", projectController.upload.array('images'), projectController.updateProject);
router.delete("/projects/:id", projectController.deleteProject);

module.exports = router;