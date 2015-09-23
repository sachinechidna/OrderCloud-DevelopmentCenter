angular.module( 'orderCloud' )
	.factory( 'Classes', ClassesService )
;


function ClassesService($q, Underscore) {
	var service = {
		List: _list,
		Get: _get
	};

	function _list() {
		var d = $q.defer();
		d.resolve(classes);
		return d.promise;
	}

	function _get(value) {
		var d= $q.defer();
		if (angular.isArray(value)) {
			var queue = [],
				classList = [];

			angular.forEach(value, function(classID) {
				queue.push((function() {
					var qd = $q.defer();
					_get(classID)
						.then(function(data) {
							if (data) classList.push(data);
							qd.resolve();
						});
					return qd.promise;
				})())
			});

			$q.all(queue).then(function() {d.resolve(classList)});
		} else {
			d.resolve(Underscore.where(classes, {ID: value})[0]);
		}
		return d.promise;
	}

	var classes = [
		{
			ID: 'api',
			Name: 'RESTful API',
			Description: 'What is a RESTful API?',
			TemplateUrl: 'courses/classTemplates/intro.api.tpl.html',
			Interactive: false
		},
		{
			ID: 'ordercloud',
			Name: 'OrderCloud API',
			Description: 'How does OrderCloud work?',
			TemplateUrl: 'courses/classTemplates/intro.ordercloud.tpl.html',
			ReadmeScripts: [
				"{\n\t\"Meta\": {\n\t\t\"Page\": 1,\n\t\t\"PageSize\": 20,\n\t\t\"TotalCount\": 25,\n\t\t\"TotalPages\": 2,\n\t\t\"ItemRange\": [1,20]\n\t}\n}",
				"[{\n\t\"ErrorCode\": \"FirstNameRequired\",\n\t\"Message\": \"First Name is required.\"\n},\n{\n\t\"ErrorCode\": \"LastNameRequired\",\n\t\"Message\": \"Last Name is required.\"\n}]"
			],
			Interactive: false
		},
		{
			ID: 'tools',
			Name: 'OrderCloud Development Tools',
			Description: 'What are the tools available?',
			TemplateUrl: 'courses/classTemplates/intro.tools.tpl.html',
			Interactive: false
		},
		{
			ID: 'sdk',
			Name: 'OrderCloud AngularJS SDK',
			Description: 'An in depth look at the AngularJS SDK for OrderCloud',
			TemplateUrl: 'courses/classTemplates/intro.sdk.tpl.html',
			Interactive: false
		},
		{
			ID: 'authentication',
			Name: 'Authentication',
			Description: 'Use the Credentials service to store your auth token',
			TemplateUrl: 'courses/classTemplates/basics.auth.tpl.html',
			Interactive: true,
			ScriptModels: {
				Meta: {
					ExecuteAll: false
				},
				Scripts: [
					{
					Title: 'create.js',
					Model: "\nvar creds = {\n\tUsername: 'mlund',\n\tPassword: 'fails345'\n};\n\nCredentials.Get(creds);",
					Disable: false,
					ListOrder: 1,
					ExecuteOrder: null,
					NextOnSuccess: true
					}
				]
			},
			Dependencies: ["Credentials","Me"],
			ClassMethods: ['Me.Get']
		},
		{
			ID: 'create-buyer',
			Name: 'Create a Buyer',
			Description: 'Create a buyer to use in your application',
			TemplateUrl: 'courses/classTemplates/basics.create-buyer.tpl.html',
			Interactive: true,
			ScriptModels: {
				Meta: {
					ExecuteAll: false
				},
				Scripts: [
					{
					Title: 'create.js',
					Model: "\nvar buyer = {\n\tName: '...',\n\tActive: true\n};\n\nBuyers.Create(buyer);",
					Disable: false,
					ListOrder: 1,
					ExecuteOrder: null,
					NextOnSuccess: true
					}
				]
			},
			Dependencies: ["Buyers"],
			ClassMethods: ['Buyers.Create']
		},
		{
			ID: 'create-buyer-user',
			Name: 'Create a User',
			Description: 'Create your first user under your new buyer company',
			TemplateUrl: 'courses/classTemplates/basics.create-user.tpl.html',
			Interactive: true,
			ScriptModels: {
				Meta: {
					ExecuteAll: false
				},
				Scripts: [
					{
					Title: 'create.js',
					Model: "\nvar buyerID = {buyerID};\n\nvar user = {\n\tUsername: '...',\n\tPassword: '...',\n\tFirstName: '...',\n\tLastName: '...',\n\tEmail: '...',\n\tActive: true\n};\n\nUsers.Create(buyerID, user);",
					Disable: false,
					ListOrder: 1,
					ExecuteOrder: null,
					NextOnSuccess: true
					}
				]
			},
			Dependencies: ["Users"],
			ClassMethods: ['Users.Create']
		},
		{
			ID: 'api-access',
			Name: 'API Access Claim',
			Description: 'Create an access claim to receive your buyers clientID',
			TemplateUrl: 'courses/classTemplates/basics.access-claim.tpl.html',
			Interactive: true,
			ScriptModels: {
				Meta: {
					ExecuteAll: false
				},
				Scripts: [
					{
					Title: 'create.js',
					Model: "\nvar claim = {\n\tAccessTokenDuration: 99999999,\n\tActive: true,\n\tAppName: '...',\n\tClaims: [\n\t\t'FullAccess'\n\t],\n\tRefreshTokenDuration: 99999999\n};\n\nBuyerApiAccess.Create(claim);",
					Disable: false,
					ListOrder: 1,
					ExecuteOrder: null,
					NextOnSuccess: true
					}
				]
			},
			Dependencies: ["BuyerApiAccess"],
			ClassMethods: ['ApiClients.Create']
		},
		{
			ID: 'get-me',
			Name: 'Get Authenticated User',
			Description: "Use the 'Me' service to gain access to the current authenticated user information",
			TemplateUrl: 'courses/classTemplates/basics.get-me.tpl.html',
			Interactive: true,
			ScriptModels: {
				Meta: {
					ExecuteAll: false
				},
				Scripts: [
					{
						Title: 'create.js',
						Model: "\n\nMe.Get();",
						Disable: false,
						ListOrder: 1,
						ExecuteOrder: null,
						NextOnSuccess: true
					}
				]
			},
			Dependencies: ["Me"],
			ClassMethods: ['Me.Get']
		},
		{
			ID: 'prod-crud',
			Name: 'Setting up a Product',
			Description: "Create or access a product to be used in later classes",
			TemplateUrl: 'courses/classTemplates/user-prod-access.prod-crud.tpl.html',
			Interactive: true,
			ScriptModels: {
				Meta: {
					ExecuteAll: false
				},
				Scripts: [
					{
						Title: 'create.js',
						Model: '\n\nvar prod = {Products.Create};\n\n\nProducts.Create(prod);',
						Disable: false,
						ListOrder: 1,
						ExecuteOrder: null,
						NextOnSuccess: true
					},
					{
						Title: 'get.js',
						Model: '\n\n\nProducts.Get();',
						Disable: false,
						ListOrder: 2,
						ExecuteOrder: null,
						NextOnSuccess: true
					},
					{
						Title: 'update.js',
						Model: '\n//must provide entire object in update\n\nvar prod = {Products.Create};\n\n\nProducts.Update(prod);',
						Disable: false,
						ListOrder: 3,
						ExecuteOrder: null,
						NextOnSuccess: false
					},
					{
						Title: 'patch.js',
						Model: '\n//will only update Description\n\nvar prod = {\n\tID: "...",\n\tDescription: "..."\n};\n\n\nProducts.Update(prod); ',
						Disable: false,
						ListOrder: 4,
						ExecuteOrder: null,
						NextOnSuccess: false
					},
					{
						Title: 'delete.js',
						Model: '\n\n var productID = {productID};\n\n Products.Delete(productID);',
						Disable: false,
						ListOrder: 5,
						ExecuteOrder: null,
						NextOnSuccess: false
					}
				]
			},
			Dependencies: ["Products"],
			ClassMethods: ['Products.Create']
		},
		{
			ID: 'price-sched-crud',
			Name: 'Defining a Price Schedule',
			Description: "Create or access a price schedule to be used in creating a product assignment to your buyer-user",
			TemplateUrl: 'courses/classTemplates/user-prod-access.price-sched-crud.tpl.html',
			Interactive: true,
			ScriptModels: {
				Meta: {
					ExecuteAll: false
				},
				Scripts: [
					{
						Title: 'create.js',
						Model: '\n\nvar ps = {PriceSchedules.Create};\n\n\nProducts.Create(prod);',
						Disable: false,
						ListOrder: 1,
						ExecuteOrder: null,
						NextOnSuccess: true
					},
					{
						Title: 'get.js',
						Model: '\n\nvar priceScheduleID = {priceScheduleID};\n\n\nProducts.Get(priceScheduleID);',
						Disable: false,
						ListOrder: 2,
						ExecuteOrder: null,
						NextOnSuccess: true
					},
					{
						Title: 'list.js',
						Model: '\n\n\nProducts.List();',
						Disable: false,
						ListOrder: 3,
						ExecuteOrder: null,
						NextOnSuccess: false
					},
					{
						Title: 'update.js',
						Model: '\n\nvar ps = {PriceSchedules.Update};\n\n\nProducts.Create(prod);',
						Disable: false,
						ListOrder: 4,
						ExecuteOrder: null,
						NextOnSuccess: false
					},
					{
						Title: 'patch.js',
						Model: '\n\nvar ps = {PriceSchedules.Patch};\n\n\nProducts.Create(prod);',
						Disable: false,
						ListOrder: 5,
						ExecuteOrder: null,
						NextOnSuccess: false
					},
					{
						Title: 'delete.js',
						Model: '\n\nvar priceScheduleID = {priceScheduleID};\n\n\nProducts.Delete(priceScheduleID);',
						Disable: false,
						ListOrder: 6,
						ExecuteOrder: null,
						NextOnSuccess: false
					}

				]
			},
			Dependencies: ["PriceSchedules"],
			ClassMethods: ['PriceSchedules.Create', 'PriceSchedules.Update', 'PriceSchedules.Patch']
		},
		{
			ID: 'prod-assignments',
			Name: 'Product Assignments',
			Description: "Assign your product to a user with your newly created price schedule",
			TemplateUrl: 'courses/classTemplates/user-prod-access.prod-assignments.tpl.html',
			Interactive: true,
			ScriptModels: {
				Meta: {
					ExecuteAll: false
				},
				Scripts: [
					{
						Title: 'create.js',
						Model: '',
						Disable: false,
						ListOrder: 1,
						ExecuteOrder: null,
						NextOnSuccess: true
					}
				]
			},
			Dependencies: ["PriceSchedules"],
			ClassMethods: ['Products.Create']
		},
		{
			ID: 'category-crud',
			Name: 'Setting a Category',
			Description: "Create or Get a category that you will give a user access to",
			TemplateUrl: 'courses/classTemplates/user-prod-access.category-crud.tpl.html',
			Interactive: true,
			ScriptModels: {
				Meta: {
					ExecuteAll: false
				},
				Scripts: [
					{
						Title: 'create.js',
						Model: '',
						Disable: false,
						ListOrder: 1,
						ExecuteOrder: null,
						NextOnSuccess: true
					}
				]
			},
			Dependencies: ["PriceSchedules"],
			ClassMethods: ['Products.Create']
		},
		{
			ID: 'category-assignment',
			Name: 'Category Assignment',
			Description: "Assign your category to a user and your product to the category",
			TemplateUrl: 'courses/classTemplates/user-prod-access.category-assignment.tpl.html',
			Interactive: true,
			ScriptModels: {
				Meta: {
					ExecuteAll: false
				},
				Scripts: [
					{
						Title: 'create.js',
						Model: '',
						Disable: false,
						ListOrder: 1,
						ExecuteOrder: null,
						NextOnSuccess: true
					}
				]
			},
			Dependencies: ["PriceSchedules"],
			ClassMethods: ['Products.Create']
		},
		{
			ID: 'get-products-as-user',
			Name: 'Get User Products',
			Description: "Authenticate as a user",
			TemplateUrl: 'courses/classTemplates/user-prod-access.get-product-as-user.tpl.html',
			Interactive: true,
			ScriptModels: {
				Meta: {
					ExecuteAll: false
				},
				Scripts: [
					{
						Title: 'create.js',
						Model: '',
						Disable: false,
						ListOrder: 1,
						ExecuteOrder: null,
						NextOnSuccess: true
					}
				]
			},
			Dependencies: ["PriceSchedules"],
			ClassMethods: ['Products.Create']
		},

	];

	return service;
}