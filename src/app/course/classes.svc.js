angular.module('orderCloud')
    .factory('ClassesService', ClassesService);


function ClassesService($filter) {

    function getClass(classID) {
        var returnObj = {};
        classes.forEach(function(c) {
            if (c.ID == classID) {
                returnObj = c;
            }
        });

        return returnObj;
    }

    function _getClassList(classIDs, selections) {
        var output = [];
        var tempObj = {};
        classIDs.forEach(function(ID) {
            var c = getClass(ID);
            if (!selections) {
                output.push(c);
            } else {
                selections.forEach(function(select) {
                    if (c[select]) {
                        tempObj[select] = c[select];
                    } else {
                        console.log('"' + select + '" does not exist in "' + c.Name + '" class object')
                    }
                });
                output.push(tempObj);
                tempObj = {};
            }
        });
        return output;
    }

    function stringifyAceModels(scripts) {
        for ( var i = 0; i < scripts.length; i++ ) {
            if ( typeof scripts[i] != 'string' ) {
                scripts[i] = $filter('json')(scripts[i]);
            }
        }
        return scripts;
    }

    function _setScope(classID) {
        var returnObject = getClass(classID);
        returnObject.Request = {};
        returnObject.LeftScripts = stringifyAceModels(returnObject.LeftScripts);
        if (returnObject.Xp.SetResponse) {
            returnObject.Request.Response = $filter('json')(returnObject.Xp.SetResponse);
        }
        return returnObject;
    }


    var classes =
        [
            {
                Name: "RESTful API Intro",
                ID: "api-intro",
                Description: "Learn the basics of a RESTful API architecture, and how it is used in OrderCloud 3.0",
                Active: true,
                LeftContent: "course/classes/api/api-intro.tpl.html",
                LeftScripts: [
                    {
                        BuyerName: "...",
                        BuyerID: "...",
                        Active: false
                    }
                ],
                ShowHeaders: true,
                EditMode: "json",
                ApiCall: {
                    Method: "GET",
                    Url: "api.ordercloud.io/v1/buyers/four51/users/df5h78",
                    Headers: {
                        ContentType: "application/json",
                        Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUz"
                    },
                    Params: {},
                    Object: ""
                },
                Xp: {
                    SetResponse: {
                        ID: "df5h78",
                        Username: "BobJohnson",
                        FirstName: "Bob",
                        LastName: "Johnson",
                        Email: "bobjohnson@four51.com",
                        Phone: "555-555-5555",
                        TermsAccepted: "2016-01-01T03:02:01+05:03",
                        Active: true,
                        xp: null
                    },
                    Hints: [
                        "Did you know that Four51 opened its doors in 1999? In Fact, our current Data-Model was started then and has been refined for over 15 years to make it what it is today",
                        "Did you know that the World Wide Web conforms with the REST architecture style? In fact, REST was developed in parallel with HTTP in the late '90s."
                    ]
                }

            },
            {
                Name: "Intro to Authentication",
                ID: "auth-intro",
                Description: "Learn how to authenticate your administrative user to begin working with OrderCloud 3.0",
                Active: true,
                LeftContent: "course/classes/authentication/auth-intro.tpl.html",
                LeftScripts: [
                    "client_id=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx&grant_type=password&username=xxxxxxxx&password=xxxxxxxx&scope=FullAccess"
                ],
                ShowHeaders: false,
                EditMode: "",
                ApiCall: {
                    Method: "POST",
                    Url: "https://{apiEnv}auth.ordercloud.io/oauth/token",
                    Headers: {},
                    Params: {},
                    Object: ""
                },
                Xp: {
                    Hints: [
                        "This API has a very robust error handling process. If your API call returns an error, make sure to use the response console to find out what's wrong and how to fix it."
                    ]
                }
            },
            {
                Name: "Create a Buyer",
                ID: "create-buyer",
                Description: "Take your first steps into OrderCloud 3.0 by creating a new Buyer",
                Active: true,
                LeftContent: "course/classes/buyers/create-buyer.tpl.html",
                LeftScripts: [
                    "\nMethod: POST\nLocation: https://api.ordercloud.io/v1/buyers\nContent-Type: application/json\nAuthentication: Bearer {token}\n",
                    {
                        Name: "...",
                        ID: "...",
                        Active: true
                    }
                ],
                SelectedService: 'Buyers',
                SelectedMethod: 'Create',
                Mode: 'API',
                Xp: {
                    Hints: [
                        "Use the API Console to the left to create your new buyer. If you'd like to have your console auto-fill, change the settings in the dropdown on the upper left of the console window.",
                        "This API has a very robust error handling process. If your API call returns an error, make sure to use the response console to find out what's wrong and how to fix it."
                    ]
                }
            },
            {
                Name: "Create a Product",
                ID: "create-product",
                Description: "Learn the fundamentals of creating a Product in OrderCloud 3.0",
                Active: true,
                LeftContent: "course/classes/products/create-product.tpl.html",
                LeftScripts: [
                    "\nMethod: POST\nLocation: https://api.ordercloud.io/v1/products\nContent-Type: application/json\nAuthentication: Bearer {token}\n",
                    {
                        ID: "...",
                        Description: "...",
                        Name: "...",
                        QuantityMultiplier: 0,
                        ShipWeight: null,
                        Active: false,
                        Type: "Static",
                        StdOrders: false,
                        ReplOrders: false,
                        InventoryEnabled: false,
                        InventoryNotificationPoint: null,
                        VariantLevelInventory: false,
                        xp: null,
                        ExceedInventory: false,
                        DisplayInventory: false
                    }
                ],
                ShowHeaders: true,
                EditMode: "json",
                ApiCall: {
                    Method: "POST",
                    Url: "https://{apiEnv}api.ordercloud.io/v1/products",
                    Headers: {
                        ContentType: "application/json",
                        Authorization: "Bearer {token}"
                    },
                    Params: {},
                    Object: {
                        Description: "...",
                        Name: "...",
                        QuantityMultiplier: 0,
                        ShipWeight: null,
                        Active: false
                    }
                },
                Xp: {
                    Hints: [
                        "Use the API Console to the left to create your new buyer. If you'd like to have your console auto-fill, change the settings in the dropdown on the upper left of the console window.",
                        "This API has a very robust error handling process. If your API call returns an error, make sure to use the response console to find out what's wrong and how to fix it."
                    ]
                }

            },
            {
                Name: "Create a Category",
                ID: "create-category",
                Description: "Learn the fundamentals of creating a Category in OrderCloud 3.0",
                Active: true,
                LeftContent: "course/classes/categories/create-category.tpl.html",
                LeftScripts: [
                    "\nMethod: POST\nLocation: https://api.ordercloud.io/v1/buyers/{buyerID}/categories\nContent-Type: application/json\nAuthentication: Bearer {token}\n",
                    {
                        ID: "...",
                        Name: "...",
                        Description: "...",
                        xp: null,
                        ListOrder: 1,
                        Active: false,
                        ParentID: "..."
                    }
                ],
                ShowHeaders: true,
                EditMode: "json",
                ApiCall: {
                    Method: "POST",
                    Url: "https://{apiEnv}api.ordercloud.io/v1/buyers/{buyerID}/categories",
                    Headers: {
                        ContentType: "application/json",
                        Authorization: "Bearer {token}"
                    },
                    Params: {},
                    Object: {
                        ID: "...",
                        Name: "...",
                        Description: "...",
                        xp: null,
                        ListOrder: 1,
                        Active: false,
                        ParentID: "..."
                    }
                },
                Xp: {
                    Hints: []
                }
            },
            {
                Name: "Create a User",
                ID: "create-user",
                Description: "Learn the fundamentals of creating a User in OrderCloud 3.0",
                Active: true
            },
            {
                Name: "Create a User Group",
                ID: "create-usergroup",
                Description: "Learn the fundamentals of creating a UserGroup in OrderCloud 3.0",
                Active: true
            }

        ];
    return {
        setScope: _setScope,
        getClassList: _getClassList
    }
}
