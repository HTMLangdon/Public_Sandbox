export var LoginMeta = [
	{
		type: "login-box",
		items: [
			{
				type: "banner",
				id: "msgBanner",
				text: "This is sample user feedback text."
			},
			{
				type: "logo--login",
				image: "~/assets/img/x_logo.png"
			},
			{
				type: "title--thin",
				title: 'Content:Login:PageHeaderName',
				size: "h2"
			},
			{
				type: "paragraph-resource",
				text: 'Content:Login:PageHeaderPrompt'
			},
			{
				type: 'forms--novalidate',
				id: 'loginform',
				items: [{
					type: 'input--label-under',
					id: 'txtUsername',
					placeholder: 'Content:Login:LoginTypeName',
					label: 'Content:Login:LoginPromptName',
					required: 1,
					bindValue: 'UserId',
					errormsg: 'Message:Ln001'
				},
				{
					type: 'input-password--label-under',
					id: 'txtPassword',
					unmaskid: 'icnUmask',
					placeholder: 'Content:Login:PWTypeName',
					label: 'Content:Login:PWPromptName',
					required: 1,
					bindValue: 'Password',
					errormsg: 'Invalid password'
				},
				{
					type: 'input-switch--right',
					text: 'Content:Login:RememberCredPromptName',
					label: 'remember'
				},
				{
					type: 'btn--submit--right',
					id: 'btnLogin',
					text: 'Content:Login:LoginButtonText',
					label: 'btnLogin'
				}]
			},
			{
				type: 'login__footer',
				items: [{
					text: 'Content:Login:ForgotCredPromptName',
					url: '~/pages/ResetPassword.aspx'
				}, {
					text: 'Content:Login:RegisterPromptName',
					url: '~/pages/modern/enroll.aspx'
				}]
			}
		]
	}
];
