angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('js/components/cropImage/cropImage.html',
    "<div class=\"row\">\n" +
    "  	<div class=\"col-md-8\">\n" +
    "  		<div class=\"col-md-12\">\n" +
    "			<div class=\"img-container\">\n" +
    "		  		<img ng-cropper\n" +
    "				     ng-cropper-proxy=\"ctrl.cropperProxy\"\n" +
    "				     ng-cropper-show=\"ctrl.showEvent\"\n" +
    "				     ng-cropper-hide=\"ctrl.hideEvent\"\n" +
    "				     ng-cropper-options=\"ctrl.options\">\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"col-md-12\">\n" +
    "			<form class=\"col-md-12 well\" ng-if=\"ctrl.showEditButtons\">\n" +
    "				<fieldset class=\"col-md-8\">\n" +
    "					<h5>Bracelet Size</h5>\n" +
    "\n" +
    "					<div class=\"row\">\n" +
    "						<div class=\"form-group col-md-6\">\n" +
    "						    <label for=\"height\">Height:</label>\n" +
    "						    <select id=\"height\"\n" +
    "					    			class=\"form-control\"\n" +
    "					    			ng-model=\"ctrl.selectedHeight\"\n" +
    "									ng-options=\"option.beads as option.description for option in ctrl.heightOptions\"\n" +
    "									ng-change=\"ctrl.updatePreview()\">\n" +
    "							</select>\n" +
    "						</div>\n" +
    "						<div class=\"form-group col-md-6\">\n" +
    "						    <label for=\"width\">Width:</label>\n" +
    "						    <select id=\"width\"\n" +
    "					    			class=\"form-control\"\n" +
    "					    			ng-model=\"ctrl.selectedWidth\"\n" +
    "									ng-options=\"option.beads as option.description for option in ctrl.widthOptions\"\n" +
    "									ng-change=\"ctrl.updatePreview()\">\n" +
    "							</select>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "				</fieldset>\n" +
    "\n" +
    "				<fieldset class=\"col-md-4\">\n" +
    "					<h5>Bead Colors</h5>\n" +
    "\n" +
    "					<div class=\"form-group\">\n" +
    "					    <label for=\"width\">Count:</label>\n" +
    "					    <select id=\"width\"\n" +
    "				    			class=\"form-control\"\n" +
    "				    			ng-model=\"ctrl.colorCount\"\n" +
    "								ng-options=\"n for n in [] | range:12:21\">\n" +
    "						</select>\n" +
    "					</div>\n" +
    "				</fieldset>\n" +
    "\n" +
    "				<fieldset class=\"col-md-12\">\n" +
    "					<h5>Edit</h5>\n" +
    "\n" +
    "				 	<div class=\"col-md-8 form-group\">\n" +
    "				    	<label for=\"rotateSlider\">Rotate</label>\n" +
    "				    	<slider id=\"rotateSlider\"\n" +
    "				    			slider-id=\"rotateSlider\"\n" +
    "				    			ng-model=\"ctrl.rotation\"\n" +
    "				    			ticks=\"[-180, -90, 0, 90, 180]\"\n" +
    "				    			ticks-labels='[\"-180&deg;\", \"-90&deg;\", \"0&deg;\", \"90&deg;\", \"180&deg;\"]'\n" +
    "				    			ticks-snap-bounds=\"5\"\n" +
    "				    			value=\"0\"\n" +
    "				    			selection=\"none\"\n" +
    "				    			on-slide=\"ctrl.rotate(value)\"\n" +
    "				    			on-stop-slide=\"ctrl.updatePreview()\">\n" +
    "				    	</slider>\n" +
    "					</div>\n" +
    "\n" +
    "					<div class=\"col-md-4 form-group\">\n" +
    "				    	<label for=\"zoomButtons\">Zoom</label>\n" +
    "\n" +
    "				    	<div id=\"zoomButtons\" class=\"btn-group btn-group-justified col-md-12\" role=\"group\">\n" +
    "						  	<a type=\"button\" class=\"btn btn-default\" ng-click=\"ctrl.zoom(-0.1)\">\n" +
    "						  		<span class=\"glyphicon glyphicon-zoom-out\"></span>\n" +
    "						  	</a>\n" +
    "\n" +
    "						  	<a type=\"button\" class=\"btn btn-default\" ng-click=\"ctrl.zoom(0.1)\">\n" +
    "						  		<span class=\"glyphicon glyphicon-zoom-in\"></span>\n" +
    "						  	</a>\n" +
    "						</div>\n" +
    "				 	</div>\n" +
    "				</fieldset>\n" +
    "			</form>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"col-md-4 preview-container row\">\n" +
    "		<div class=\"col-md-12\">\n" +
    "			<img ng-src=\"{{ctrl.previewUrl}}\"\n" +
    "			     color-thief\n" +
    "			     color-thief-dominant=\"ctrl.dominantColor\">\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('js/components/fileUpload/fileUpload.html',
    "<form name=\"ctrl.uploadForm\" class=\"file-upload\">\n" +
    "	<div class=\"file-input form-group col-md-12\">\n" +
    "		<label for=\"fileInput\">{{ctrl.fileLabel || 'Select Image'}}</label>\n" +
    "\n" +
    "		<input type=\"file\" \n" +
    "			   class=\"form-control\" \n" +
    "			   id=\"fileInput\" \n" +
    "			   name=\"fileInput\" \n" +
    "			   onchange=\"angular.element(this).scope().onUpload(this.files[0])\">\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"col-md-12\" style=\"text-align:center\">\n" +
    "		<h3>or</h3>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"link-input form-group col-md-12\" ng-class=\"{'has-error': ctrl.linkError}\">\n" +
    "		<label for=\"linkInput\">{{ctrl.linkLabel || 'From URL'}}</label>\n" +
    "\n" +
    "		<div class=\"input-group\">\n" +
    "	      <input type=\"text\" \n" +
    "	      		 class=\"form-control\" \n" +
    "	      		 name=\"linkInput\" \n" +
    "	      		 placeholder=\"http://www...\" \n" +
    "	      		 ng-model=\"ctrl.inputLink\" \n" +
    "	      		 ng-change=\"ctrl.updateLink()\" \n" +
    "	      		 aria-describedby=\"linkErrorMessage\">\n" +
    "\n" +
    "	      <span class=\"input-group-btn\">\n" +
    "	        <button class=\"btn btn-default\" type=\"button\" ng-click=\"ctrl.checkLink(ctrl.inputLink)\">Upload</button>\n" +
    "	      </span>\n" +
    "	    </div>\n" +
    "\n" +
    "	    <span ng-if=\"ctrl.linkError\" id=\"linkErrorMessage\" class=\"help-block\">{{ctrl.linkErrorMessage}}</span>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('js/components/navbar/navbar.html',
    "<nav class=\"navbar navbar-default navbar-static-top\">\n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"navbar-header\">\n" +
    "      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\" aria-expanded=\"false\">\n" +
    "        <span class=\"sr-only\">Toggle navigation</span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "      </button>\n" +
    "\n" +
    "      <a class=\"navbar-brand\" href=\"/\">PeyPer</a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "        <li class=\"active\"><a href=\"/\">Home <span class=\"sr-only\">(current)</span></a></li>\n" +
    "        <li><a href=\"/about\">About</a></li>\n" +
    "        <li><a href=\"/faq\">FAQ</a></li>\n" +
    "      </ul>\n" +
    "      <ul class=\"nav navbar-nav navbar-right\">\n" +
    "        <li><a href=\"/contact\">Contact</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</nav>"
  );


  $templateCache.put('js/components/orderReview/orderReview.html',
    "<div class=\"col-md-12\">\n" +
    "    <p>\n" +
    "        A preview of the template is shown on the right. This is NOT the actual template but rather an approximation of what the template will look like after it's created. \n" +
    "    </p>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"well col-md-12\">\n" +
    "    <div class=\"text-center\">\n" +
    "        <h1>Finalize Order</h1>\n" +
    "    </div>\n" +
    "    <table class=\"table table-hover\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th></th>\n" +
    "                <th>Product</th>\n" +
    "                <th class=\"text-center\">#</th>\n" +
    "                <th class=\"text-center\">Price</th>\n" +
    "                <th class=\"text-center\">Total</th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr>\n" +
    "                <td class=\"col-md-1 text-center\"></td>\n" +
    "                <td class=\"col-md-7\"><em> Peyote Stitch Template ({{ctrl.templateSize.beads.display}}) </em></td>\n" +
    "                <td class=\"col-md-2\" style=\"text-align: center\"> 1 </td>\n" +
    "                <td class=\"col-md-1 text-center\"> {{ctrl.templatePrice | currency:'$':2}} </td>\n" +
    "                <td class=\"col-md-1 text-center\"> {{ctrl.templatePrice | currency:'$':2}} </td>\n" +
    "            </tr>\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"col-md-1 text-center\">\n" +
    "                    <input type=\"checkbox\" \n" +
    "                           ng-model=\"ctrl.includeBeads\" \n" +
    "                           ng-change=\"ctrl.updateFinalPrice()\">\n" +
    "                </td>\n" +
    "                <td class=\"col-md-7\"><em>Include Beads With Purchase</em></td>\n" +
    "                <td class=\"col-md-2\" style=\"text-align: center\"> -- </td>\n" +
    "                <td class=\"col-md-1 text-center\"> -- </td>\n" +
    "                <td class=\"col-md-1 text-center\"> -- </td>\n" +
    "            </tr>\n" +
    "\n" +
    "            <tr class=\"collapsable-row\" ng-if=\"ctrl.includeBeads\">\n" +
    "                <td class=\"col-md-1 text-center\"></td>\n" +
    "                <td class=\"col-md-7\"><em> • Size ({{ctrl.templateSize.inches.display}}) </em></td>\n" +
    "                <td class=\"col-md-2\" style=\"text-align: center\"> {{ctrl.templateSize.inches.value}} in.<sup>2</sup> </td>\n" +
    "                <td class=\"col-md-1 text-center\"> {{ctrl.pricePerSquareInch | currency:'$':2}} </td>\n" +
    "                <td class=\"col-md-1 text-center\"> {{ctrl.templateSize.inches.value * ctrl.pricePerSquareInch | currency:'$':2}} </td>\n" +
    "            </tr>\n" +
    "\n" +
    "            <tr class=\"collapsable-row\" ng-if=\"ctrl.includeBeads\">\n" +
    "                <td class=\"col-md-1 text-center\"></td>\n" +
    "                <td class=\"col-md-7\"><em> • Extra colors (colors over 12)</em></td>\n" +
    "                <td class=\"col-md-2\" style=\"text-align: center\"> {{ctrl.colorCount - 12}} </td>\n" +
    "                <td class=\"col-md-1 text-center\"> {{ctrl.pricePerColor | currency:'$':2}} </td>\n" +
    "                <td class=\"col-md-1 text-center\"> {{(ctrl.colorCount - 12) * ctrl.pricePerColor | currency:'$':2}} </td>\n" +
    "            </tr>\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"col-md-1 text-center\">\n" +
    "                    <input type=\"checkbox\" \n" +
    "                           ng-model=\"ctrl.includeClasps\" \n" +
    "                           ng-change=\"ctrl.updateFinalPrice()\">\n" +
    "                </td>\n" +
    "                <td class=\"col-md-7\"><em>Include Clasps</em></td>\n" +
    "                <td class=\"col-md-2\" style=\"text-align: center\"> {{ctrl.includeClasps ? '1' : '0'}} </td>\n" +
    "                <td class=\"col-md-1 text-center\"> {{ctrl.priceForClasps | currency:'$':2}} </td>\n" +
    "                <td class=\"col-md-1 text-center\"> {{ctrl.priceForClasps * (ctrl.includeClasps ? 1 : 0) | currency:'$':2}} </td>\n" +
    "            </tr>\n" +
    "\n" +
    "            <tr>\n" +
    "                <td>   </td>\n" +
    "                <td>   </td>\n" +
    "                <td>   </td>\n" +
    "                <td class=\"text-right\">\n" +
    "                    <p><strong>Subtotal: </strong></p>\n" +
    "                    <p><strong>Tax: </strong></p>\n" +
    "                    <p ng-if=\"ctrl.mustShip()\"><strong>Shipping: </strong></p>\n" +
    "                </td>\n" +
    "                <td class=\"text-center\">\n" +
    "                    <p><strong> {{ctrl.subtotal | currency:'$':2}} </strong></p>\n" +
    "                    <p><strong> {{ctrl.subtotal * ctrl.salesTax | currency:'$':2}} </strong></p>\n" +
    "                    <p ng-if=\"ctrl.mustShip()\"><strong>{{ctrl.priceToShip | currency:'$':2}}</strong></p>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td>   </td>\n" +
    "                <td>   </td>\n" +
    "                <td>   </td>\n" +
    "                <td class=\"text-right\"><h4><strong>Total: </strong></h4></td>\n" +
    "                <td class=\"text-center text-danger\"><h4><strong> {{ctrl.finalPrice | currency:'$':2}}</strong></h4></td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>\n"
  );


  $templateCache.put('js/components/payment/makePayment.html',
    "<div class=\"col-md-12\">\n" +
    "	<div class=\"row panel panel-warning\">\n" +
    "		<div class=\"panel-body\">\n" +
    "			<h3 class=\"col-md-12\" style=\"text-align: center\">\n" +
    "				<strong>\n" +
    "					<span style=\"font-style: italic\">Total price: </span>\n" +
    "					<span class=\"text-danger\">{{ctrl.totalPrice | currency:'$':2}}</span>\n" +
    "				</strong>\n" +
    "			</h3>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"row make-payment\">\n" +
    "		<div class=\"col-md-6\">\n" +
    "			<legend>Payment Info</legend>\n" +
    "\n" +
    "			<div class=\"well\">\n" +
    "				<stripe-payment get-token=\"ctrl.getToken\" can-create-token=\"ctrl.canCreateToken\"></stripe-payment>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<form name=\"cardholderInfo\" class=\"col-md-6\">\n" +
    "			<fieldset>\n" +
    "				<legend>Send To</legend>\n" +
    "\n" +
    "				<div class=\"row\">\n" +
    "					<div class=\"form-group col-md-12\">\n" +
    "						<label for=\"email\">Email</label>\n" +
    "						<input id=\"email\" type=\"email\" placeholder=\"Email\" class=\"form-control\" ng-model=\"ctrl.email\">\n" +
    "					</div>\n" +
    "\n" +
    "					<div class=\"form-group col-md-12\">\n" +
    "						<label for=\"email-confirm\">Confirm Email</label>\n" +
    "						<input id=\"email-confirm\" type=\"email\" placeholder=\"Confirm Email\" class=\"form-control\" ng-model=\"ctrl.emailConfirm\">\n" +
    "					</div>\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"row\" ng-if=\"ctrl.mustShip()\">\n" +
    "					<legend>Shipping Address</legend>\n" +
    "\n" +
    "					<div class=\"form-group col-md-12\">\n" +
    "						<label class=\"col-sm-2 control-label\" for=\"textinput\">Line 1</label>\n" +
    "						<div class=\"col-sm-10\">\n" +
    "						  	<input type=\"text\" placeholder=\"Address Line 1\" class=\"form-control\">\n" +
    "						</div>\n" +
    "					</div>\n" +
    "\n" +
    "					<div class=\"form-group col-md-12\">\n" +
    "						<label class=\"col-sm-2 control-label\" for=\"textinput\">Line 2</label>\n" +
    "						<div class=\"col-sm-10\">\n" +
    "						  	<input type=\"text\" placeholder=\"Address Line 2\" class=\"form-control\">\n" +
    "						</div>\n" +
    "					</div>\n" +
    "\n" +
    "					<div class=\"form-group col-md-12\">\n" +
    "						<label class=\"col-sm-2 control-label\" for=\"textinput\">City</label>\n" +
    "						<div class=\"col-sm-10\">\n" +
    "						  	<input type=\"text\" placeholder=\"City\" class=\"form-control\">\n" +
    "						</div>\n" +
    "					</div>\n" +
    "\n" +
    "					<div class=\"form-group\">\n" +
    "						<label class=\"col-sm-2 control-label\" for=\"textinput\">Country</label>\n" +
    "						<div class=\"col-sm-10\">\n" +
    "						  	<input type=\"text\" placeholder=\"Country\" class=\"form-control\">\n" +
    "						</div>\n" +
    "					</div>\n" +
    "		        </div>\n" +
    "		    </fieldset>\n" +
    "    	</form>\n" +
    "	</div>\n" +
    "</div>\n"
  );


  $templateCache.put('js/components/payment/stripePayment/stripePayment.html',
    "<form name=\"ctrl.paymentForm\" class=\"stripe-payment\" novalidate>\n" +
    "	<div class=\"row\">\n" +
    "		<div class=\"form-group col-md-12\">\n" +
    "			<label>Name On Card</label>\n" +
    "			<input name=\"cardName\"\n" +
    "				   type=\"text\"\n" +
    "				   ng-model=\"ctrl.card.name\"\n" +
    "				   class=\"form-control\"\n" +
    "				   ng-required=\"true\">\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group col-md-9\" ng-class=\"ctrl.inputClass('cardNumber')\">\n" +
    "			<label>Card Number</label>\n" +
    "			<div class=\"input-group\">\n" +
    "				<span class=\"input-group-addon brand\" id=\"credit-card-type\">\n" +
    "					<i class=\"pf\" id=\"brand-icon\" ng-class=\"ctrl.getPfClass(ctrl.paymentForm.cardNumber.$ccEagerType)\"></i>\n" +
    "				</span>\n" +
    "				<input cc-number cc-eager-type cc-format cc-type=\"ctrl.paymentForm.cardNumber.$ccEagerType\"\n" +
    "					   type=\"text\"\n" +
    "					   name=\"cardNumber\"\n" +
    "					   ng-model=\"ctrl.card.number\"\n" +
    "					   class=\"form-control\"\n" +
    "					   ng-required=\"true\">\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group col-md-3\" ng-class=\"ctrl.inputClass('cardCvc')\">\n" +
    "			<label>CVC</label>\n" +
    "			<input cc-cvc cc-format cc-type=\"ctrl.paymentForm.cardNumber.$ccEagerType\"\n" +
    "				   name=\"cardCvc\"\n" +
    "				   type=\"text\"\n" +
    "				   ng-model=\"ctrl.card.cvc\"\n" +
    "				   class=\"form-control\"\n" +
    "				   ng-required=\"true\">\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group col-md-6\" cc-exp>\n" +
    "			<label>Expiration Date</label>\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"col-md-5\">\n" +
    "					<input cc-exp-month cc-format\n" +
    "						   type=\"text\"\n" +
    "						   placeholder=\"MM\"\n" +
    "					       name=\"cardExpMonth\"\n" +
    "						   ng-model=\"ctrl.card.exp_month\"\n" +
    "						   class=\"form-control\"\n" +
    "						   ng-required=\"true\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-md-5\">\n" +
    "					<input cc-exp-year cc-format\n" +
    "						   type=\"text\"\n" +
    "						   placeholder=\"YY\"\n" +
    "						   name=\"cardExpYear\"\n" +
    "						   ng-model=\"ctrl.card.exp_year\"\n" +
    "						   class=\"form-control\"\n" +
    "						   ng-required=\"true\">\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group col-md-6\">\n" +
    "			<label>Zip Code</label>\n" +
    "			<input name=\"cardAddressZip\"\n" +
    "				   type=\"text\"\n" +
    "				   ng-model=\"ctrl.card.address_zip\"\n" +
    "				   ng-pattern=\"/\\d{5}(?:[-\\s]\\d{4})?/\"\n" +
    "				   maxlength=\"{{ctrl.zipLength}}\"\n" +
    "				   class=\"form-control\"\n" +
    "				   ng-required=\"true\">\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</form>\n"
  );


  $templateCache.put('js/components/pictureCarousel/pictureCarousel.html',
    "<div uib-carousel class=\"picture-carousel\" active=\"ctrl.active\" interval=\"ctrl.interval\">\n" +
    "  <div uib-slide ng-repeat=\"image in ctrl.images\" index=\"image.id\">\n" +
    "    <img ng-src=\"{{image.url}}\" style=\"margin:auto;\">\n" +
    "    <div class=\"carousel-caption\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('js/finalize/finalize.html',
    "<div class=\"finalize\">\n" +
    "	<button class=\"btn btn-primary btn-lg\" ng-click=\"ctrl.checkout()\">{{ctrl.buttonText}}</button>\n" +
    "</div>"
  );


  $templateCache.put('js/finalize/modal/finalizeModal.html',
    "<div class=\"modal-header\">\n" +
    "	<a class=\"pull-right\" ng-click=\"ctrl.close()\"><span class=\"glyphicon glyphicon-remove\"></span></a>\n" +
    "    <h3 class=\"modal-title\" id=\"modal-title\">{{ctrl.currentPage.title}}</h3>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"ctrl.currentPage.id === 'uploadImage'\">\n" +
    "	<div class=\"modal-body\">\n" +
    "		<div class=\"row upload-image\">\n" +
    "		  	<div class=\"col-md-12\">\n" +
    "		  		<file-upload file-label=\"'From File'\" link-label=\"'From URL'\" on-upload=\"ctrl.onFile\"></file-upload>\n" +
    "		  	</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"modal-footer\">\n" +
    "	    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ctrl.goToNextPage()\" ng-disabled=\"!ctrl.imageUploaded()\">Next</button>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"ctrl.currentPage.id === 'cropImage'\">\n" +
    "	<div class=\"modal-body\">\n" +
    "		<div class=\"row crop-image\">\n" +
    "			<div class=\"col-md-12\">\n" +
    "				<peyote-crop uploaded-file=\"ctrl.uploadedFile\"\n" +
    "							 downloaded-url=\"ctrl.downloadedUrl\"\n" +
    "							 bead-height=\"ctrl.selectedHeight\"\n" +
    "							 bead-width=\"ctrl.selectedWidth\"\n" +
    "							 get-cropped-data=\"ctrl.getCroppedData\"\n" +
    "							 color-count=\"ctrl.colorCount\">\n" +
    "				</peyote-crop>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"modal-footer\">\n" +
    "		<button class=\"btn btn-primary\" type=\"button\" ng-click=\"ctrl.goToPreviousPage()\">Back</button>\n" +
    "	    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ctrl.cropAndContinue()\" ng-disabled=\"!ctrl.colorCount\">\n" +
    "	    	{{!ctrl.colorCount ? 'Select Bead Color Count' : 'Crop and Continue'}}\n" +
    "	    </button>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"ctrl.currentPage.id === 'reviewOrder'\">\n" +
    "	<div class=\"modal-body\">\n" +
    "		<div class=\"row review-order\">\n" +
    "			<div class=\"col-md-9\">\n" +
    "				<order-review bead-height=\"ctrl.selectedHeight\"\n" +
    "							  bead-width=\"ctrl.selectedWidth\"\n" +
    "							  color-count=\"ctrl.colorCount\"\n" +
    "							  final-price=\"ctrl.finalPrice\"\n" +
    "							  include-beads=\"ctrl.includeBeads\"\n" +
    "							  include-clasps=\"ctrl.includeClasps\"\n" +
    "							  must-ship=\"ctrl.mustShip\">\n" +
    "				</order-review>\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"col-md-3\">\n" +
    "				<pixelizer pixelize-id=\"{{ctrl.orderReviewPixelizerId}}\" pixelizer-height=\"650\" pixelizer-width=\"ctrl.previewWidth\">\n" +
    "				</pixelizer>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"modal-footer\">\n" +
    "		<button class=\"btn btn-primary\" type=\"button\" ng-click=\"ctrl.goToPreviousPage()\">Back</button>\n" +
    "	    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ctrl.goToNextPage()\">Checkout</button>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"ctrl.currentPage.id === 'addPayment'\">\n" +
    "	<div class=\"modal-body\">\n" +
    "		<div class=\"row add-payment\">\n" +
    "		  	<div class=\"col-md-12\">\n" +
    "		  		<make-payment must-ship=\"ctrl.mustShip()\"\n" +
    "		  					  total-price=\"ctrl.finalPrice\"\n" +
    "		  					  finalize-checkout=\"ctrl.finalizeCheckout\"\n" +
    "		  					  can-create-token=\"ctrl.canCreateToken\">\n" +
    "		  		</make-payment>\n" +
    "		  	</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"modal-footer\">\n" +
    "		<button class=\"btn btn-primary\" type=\"button\" ng-click=\"ctrl.goToPreviousPage()\">Back</button>\n" +
    "	    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ctrl.payAndContinue()\">Review Order</button>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('js/views/about.html',
    "<div class=\"container container-fluid about\">\n" +
    "  <p>About</p>\n" +
    "</div>"
  );


  $templateCache.put('js/views/contact.html',
    "<div class=\"container container-fluid contact\">\n" +
    "  <p>Contact</p>\n" +
    "</div>"
  );


  $templateCache.put('js/views/faq.html',
    "<div class=\"container container-fluid faq\">\n" +
    "  <p>FAQ</p>\n" +
    "</div>"
  );


  $templateCache.put('js/views/home.html',
    "<div class=\"container container-fluid home\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"text-window col-md-6\">\n" +
    "      <div class=\"heading\">\n" +
    "        <h1>Peyote Personal</h1>\n" +
    "\n" +
    "        <h2>Turn any picture into a DIY peyote stitch bracelet</h2>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"description\">\n" +
    "        <h3>Why us?</h3>\n" +
    "\n" +
    "        <ul style=\"list-style-type:none\">\n" +
    "          <li><span style=\"font-weight:bold\">It's easy.</span> We give you the option to receive the beads you will need with your kit or to buy them on your own. If you opt not to get the beads from us, we will provide you with the exact delica bead colors we recommend for your bracelet.</li>\n" +
    "\n" +
    "          <li><span style=\"font-weight:bold\">It's fun.</span> The project provides hours of entertainment, and when complete, you will have a one of a kind art piece that you can wear. They also make great presents!</li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "\n" +
    "      <finalize button-text=\"Create a Template\"></finalize>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"preview-carousel col-md-6\">\n" +
    "      <picture-carousel pic-path=\"images/previews\" \n" +
    "                        pic-prefix=\"prev\" \n" +
    "                        pic-count=\"3\" \n" +
    "                        pic-file-type=\"png\"\n" +
    "                        pic-interval-seconds=\"5\">\n" +
    "      </picture-carousel>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );

}]);
