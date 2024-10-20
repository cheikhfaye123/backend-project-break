const Product = require('../models/product'); 


const baseHtml = () => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Dashboard</title>
      <link rel="stylesheet" type="text/css" href="/styles.css"> <!-- Lien vers le fichier CSS -->
    </head>
    <body>
`;


const getNavBar = (isDashboard) => `
  <nav>
    <h1>${isDashboard ? 'Dashboard' : 'Produits'}</h1>
    <a class="nav-link" href="/products">Voir Produits</a>
    <a class="nav-link" href="/products/dashboard">Tableau de bord</a>
    <a class="nav-link" href="/products/category/Camisetas">Camisetas</a>
    <a class="nav-link" href="/products/category/Pantalones">Pantalones</a>
    <a class="nav-link" href="/products/category/Accesorios">Accesorios</a>
  </nav>
`;



const getProductCards = (products, isDashboard) => {
  return `
    <div class="product-list"> <!-- Conteneur pour les cartes -->
      ${products.map(product => `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p>Catégorie: ${product.category}</p>
          <p>Taille: ${product.size}</p>
          <p>Prix: ${product.price} €</p>

          <!-- Ajout des boutons Détails, Modifier et Supprimer -->
          <div class="product-actions">
            <button onclick="window.location.href='/products/${product._id}'">Détails</button>
            <button onclick="window.location.href='/products/dashboard/${product._id}/edit'">Modifier</button>
            
          </div>
        </div>
      `).join('')}
    </div>
  `;
};


const getDeleteProductScript = () => `
  <script>
    async function deleteProduct(productId) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        try {
          const response = await fetch('/dashboard/' + productId , {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            const result = await response.json();
            alert(result.message);
            window.location.reload(); // Recharger la page après la suppression
          } else {
            const error = await response.json();
            alert('Erreur lors de la suppression du produit: ' + error.message);
          }
        } catch (error) {
          console.error('Erreur lors de la suppression du produit:', error);
          alert('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
      }
    }
  </script>
`;





const showProducts = async (req, res) => {
  const products = await Product.find();
  const productCards = getProductCards(products);
  const html = baseHtml() + getNavBar(false) + productCards + `</body></html>`;
  res.send(html);
};

const showProductById = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  const html = baseHtml() + getNavBar(false) + `
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <img src="${product.image}" alt="${product.name}" style="max-width: 100%; height: auto;">
    <p>Catégorie: ${product.category}</p>
    <p>Taille: ${product.size}</p>
    <p>Prix: ${product.price} €</p>
    <a href="/products/dashboard">Retour au tableau de bord</a>
  </body></html>`;
  res.send(html);
};


const showDashboard = async (req, res) => {
  const products = await Product.find();
  const productCards = getProductCards(products, true);
  const html = baseHtml() + getNavBar(true) + productCards + getDeleteProductScript() + `</body></html>`;
  res.send(html);
};


const createProduct = async (req, res) => {
  try {
    const { name, description, image, category, size, price } = req.body;
    const product = new Product({ name, description, image, category, size, price });
    await product.save();
    res.redirect('/products/dashboard'); // Redirection vers le tableau de bord
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({
      message: 'Erreur lors de la création du produit',
      error: error.message,
    });
  }
};


const showEditProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  const html = baseHtml() + getNavBar(true) + `
    <h2>Modifier le produit ${product.name}</h2>
    <form action="/products/dashboard/${product._id}" method="POST">
    <input type="hidden" name="_method" value="PUT">
      <input type="text" name="name" value="${product.name}" required />
      <input type="text" name="description" value="${product.description}" required />
      <input type="text" name="image" value="${product.image}" required />
      <select name="category">
        <option value="Camisetas" ${product.category === 'Camisetas' ? 'selected' : ''}>Camisetas</option>
        <option value="Pantalones" ${product.category === 'Pantalones' ? 'selected' : ''}>Pantalones</option>
        <option value="Zapatos" ${product.category === 'Zapatos' ? 'selected' : ''}>Zapatos</option>
        <option value="Accesorios" ${product.category === 'Accesorios' ? 'selected' : ''}>Accesorios</option>
      </select>
      <select name="size">
        <option value="XS" ${product.size === 'XS' ? 'selected' : ''}>XS</option>
        <option value="S" ${product.size === 'S' ? 'selected' : ''}>S</option>
        <option value="M" ${product.size === 'M' ? 'selected' : ''}>M</option>
        <option value="L" ${product.size === 'L' ? 'selected' : ''}>L</option>
        <option value="XL" ${product.size === 'XL' ? 'selected' : ''}>XL</option>
      </select>
      <input type="number" name="price" value="${product.price}" required />
      <button type="submit">Modifier le produit</button>
    </form>
    <a href="/products/dashboard">Retour au tableau de bord</a>
  </body></html>`;
  res.send(html);
};


const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(updatedProduct); // Retourner le produit mis à jour
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du produit',
      error: error.message,
    });
  }
};




const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    return res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return res.status(500).json({
      message: 'Erreur lors de la suppression du produit',
      error: error.message,
    });
  }
};
const showProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category }); // Filter products by category
  const productCards = getProductCards(products);
  const html = baseHtml() + getNavBar(false) + productCards + `</body></html>`;
  res.send(html);
};

module.exports = { 
  showProducts, 
  showProductById, 
  showDashboard, 
  createProduct, 
  showEditProduct, 
  updateProduct, 
  deleteProduct,
  showProductsByCategory
};
