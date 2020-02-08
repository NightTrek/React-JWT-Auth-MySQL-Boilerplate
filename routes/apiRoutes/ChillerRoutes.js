const router = require('express').Router();
const chillController = require("../../controllers/chillerController");

const passportService = require('./../../services/passport');
const authMiddleware = require('./../../middlewares/authMiddlewares');

// /api/c

router.route('/')//uses Passport JWT as its auth method.
    .post(authMiddleware.requireAuth, chillController.addChiller);

//gets chillers and their statuses
router.route('/getchillers')//uses Passport JWT as its auth method.
    .post(authMiddleware.requireAuth, chillController.getChillersForUser);

router.route('/recent')
    .post(authMiddleware.requireAuth, chillController.getChillerDataForID);



module.exports = router;
