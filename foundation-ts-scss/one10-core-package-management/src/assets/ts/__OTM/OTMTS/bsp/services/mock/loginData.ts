export var logindata = {
	"items": [
		{
			"type": "login-box",
			"items": [
				{
					"type": "logo--login",
					"image": "~/assets/img/x_logo.png"
				},
				{
					"type": "title--thin",
					"title": "Sign In",
					"size": "h2"
				},
				{
					"type": "content-body",
					"text": "<p>to continue to PerformX</p>\n"
				},
				{
					"type": "forms",
					"id": "loginform",
					"items": [
						{
							"type": "input--label-under",
							"id": "username-login",
							"placeholder": "Email",
							"label": "Enter the email address you use to sign in",
							"required": 1,
							"validate": "email",
							"bindValue": "UserId",
							"errormsg": "Not a valid email address"
						},
						{
							"type": "input-password--label-under",
							"placeholder": "Password",
							"label": "Enter your password to sign in",
							"required": 1,
							"bindValue": "Password",
							"errormsg": "Invalid password"
						},
						{
							"type": "input-switch--right",
							"text": "Remember my credentials",
							"label": "remember"
						},
						{
							"type": "btn--submit--right",
							"text": "NEXT",
							"id": "loginbtn"
						}
					]
				},
				{
					"type": "login__footer",
					"items": [
						{
							"text": "Forgot email/password?",
							"url": null
						},
						{
							"text": "Register as new user",
							"url": null
						}
					]
				}
			]
		}
	]
};
