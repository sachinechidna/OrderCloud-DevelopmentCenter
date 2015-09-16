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
			ScriptModel: [
				"{\n\t\"Meta\": {\n\t\t\"Page\": 1,\n\t\t\"PageSize\": 20,\n\t\t\"TotalCount\": 25,\n\t\t\"TotalPages\": 2,\n\t\t\"ItemRange\": [1,20]\n\t}\n}",
				"[{\n\t\"ErrorCode\": \"FirstNameRequired\",\n\t\"Message\": \"First Name is required.\"\n},\n{\n\t\"ErrorCode\": \"LastNameRequired\",\n\t\"Message\": \"Last Name is required.\"\n}]"
			],
			Interactive: false
		},
		{
			ID: 'tools',
			Name: 'AngularJS & the SDK',
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
			ID: 'basics-authentication',
			Name: 'Authentication',
			Description: 'Use the Credentials service to store your auth token',
			TemplateUrl: 'courses/classTemplates/basics.auth.tpl.html',
			Interactive: true,
			ScriptModel: "var creds = {\n\tUsername: 'mlund',\n\tPassword: 'fails345'\n};\n\nCredentials.Get(creds);",
			Dependencies: ["Credentials","Me"]
		},
		{
			ID: 'basics-create-buyer',
			Name: 'Create a Buyer',
			Description: 'Create a buyer to use in your application',
			TemplateUrl: 'courses/classTemplates/basics.create-buyer.tpl.html',
			Interactive: true,
			ScriptModel: "var buyer = {\n\tName: '...',\n\tActive: true\n};\n\nBuyers.Create(buyer);",
			Dependencies: ["Buyers"]
		},
		{
			ID: 'basics-create-buyer-user',
			Name: 'Create a User',
			Description: 'Create your first user under your new buyer company',
			TemplateUrl: 'courses/classTemplates/basics.create-user.tpl.html',
			Interactive: true,
			ScriptModel: "var buyerID = {buyerID};\n\nvar user = {\n\tID: '...',\n\tUsername: '...',\n\tPassword: '...',\n\tFirstName: '...',\n\tLastName: '...',\n\tEmail: '...',\n\tPhone: '...',\n\tActive: true,\n\txp: null\n};\n\nUsers.Create(buyerID, user);",
			Dependencies: ["Users"]
		},
		{
			ID: 'api-access',
			Name: 'API Access Claim',
			Description: 'Create an access claim to receive your buyers clientID',
			TemplateUrl: 'courses/classTemplates/basics.access-claim.tpl.html',
			Interactive: true,
			ScriptModel: "var claim = {\n\tClientSecret: '...',\n\tAccessTokenDuration: 0,\n\tActive: true,\n\tAppName: '...',\n\tClaims: [\n\t\t'FullAccess'\n\t],\n\tID: '...',\n\tRefreshTokenDuration: 0,\n\tDefaultUserContextID: '...'\n};\n\nBuyerApiAccess.Create(claim);",
			Dependencies: ["BuyerApiAccess"]
		},
		{
			ID: 'basics-get-me',
			Name: 'Get Authenticated User',
			Description: "Use the 'Me' service to gain access to the current authenticated user information",
			TemplateUrl: 'courses/classTemplates/basics.get-me.tpl.html',
			Interactive: true,
			ScriptModel: "Me.Get();",
			Dependencies: ["Me"]
		}
	];

	return service;
}