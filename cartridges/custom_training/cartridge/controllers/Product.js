'use strict';

/**
 * @namespace Product
 */

var server = require('server');
server.extend(module.superModule)


server.append('Show', function (req, res, next) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var PagingModel = require('dw/web/PagingModel');
    var CatalogMgr = require('dw/catalog/CatalogMgr');

    var viewData = res.getViewData();
    var product = ProductMgr.getProduct(viewData.product.id)

    var primaryCategory = product.getPrimaryCategory();


    var productSearchApi = new ProductSearchModel();
    var lowToHighOrder = CatalogMgr.getSortingRule('price-low-to-high')
    productSearchApi.setSortingRule(lowToHighOrder)
    productSearchApi.setCategoryID(primaryCategory.ID)
    productSearchApi.search();

    var pagingModel = new PagingModel(productSearchApi.getProductSearchHits(), productSearchApi.count)
    pagingModel.setStart(0)
    pagingModel.setPageSize(4);

    var products = pagingModel.pageElements.asList();
    viewData.products = products;

    res.setViewData(viewData);
    next();
});



module.exports = server.exports();
