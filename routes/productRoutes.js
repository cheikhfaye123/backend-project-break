const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const {
  showProducts,
  showProductById,
  showDashboard,
  createProduct,
  showEditProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');


router.post('/dashboard', createProduct); 
router.get('/dashboard/:productId/edit', showEditProduct); 
router.put('/dashboard/:productId', updateProduct); 
router.delete('/dashboard/:productId', deleteProduct); 


router.get('/dashboard', showDashboard); 
router.get('/:productId', showProductById); 


router.get('/', showProducts); 

module.exports = router;
