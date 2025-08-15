const express = require('express');
const router = express.Router();
const loadCommonData = require('../middlewares/loadCommonData')

const { index, articleByCategories, singleArticle, search, author, addComment } = require('../controllers/sideController');


router .use(loadCommonData);
router.get('/', index);
router.get('/category/:name', articleByCategories);
router.get('/single/:id', singleArticle);
router.get('/search', search);
router.get('/author/:name', author);
router.post('/single/:id/comment', addComment);

// 404 Middleware
router.use((req, res, next) => {
    res.status(404).render('admin/404', {
        message: 'Page not found',
    });
});

// 500 error handler
router.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500
    res.status(status).render('errors', {
        message: err.message || 'something went wrong',
        status: status
    });
});
module.exports = router



