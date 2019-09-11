/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/
import { MockTypeMap } from 'cp/serviceShared';

export var Pages = {
	Index: {
		//Search: {
		items: [
			{
				type: "grid__columns",
				//clientMode: true,
				columnsize: "grid-y grid-frame",
				items: [
					{
						type: "grid__columns",
						columnsize: "small-12",
						items: [
							{
								type: "content-body",
								text: '<h4>Promotion Search </h4>'
							}
						]
					}
				]

			},
			{
				type: "grid__columns",
				columnsize: "grid-y grid-frame",
				items: [
					{
						type: "grid__columns",
						columnsize: "small-12",
						items: [

							{
								type: "grid__columns",
								columnsize: "grid-y grid-frame",
								items: [
									{
										type: "grid__columns",
										columnsize: "small-2",
									},
									{
										type: "page-message"
									},
									{
										type: "input-with-label",
										inputType: "text",
										label: "ID",
										required: 0
										//bindValue: UserId
									},
									{
										type: "input-with-label",
										inputType: "text",
										label: "Name",
										required: 0
										//bindValue: Password
									},
									{
										type: "content-body",
										// [TODO] Make input partials
										text: '<input type="button" class="button" id="btnSearch" value="SEARCH" />'
									}
								]
							}]
					}
				]
			}
		]
		//}
	}
};

export var PromotionStatuses = [
	{ PromotionStatusId: 1, PromotionStatusName: 'Draft' },
	{ PromotionStatusId: 2, PromotionStatusName: 'Submitted' },
	{ PromotionStatusId: 3, PromotionStatusName: 'Approved' },
	{ PromotionStatusId: 4, PromotionStatusName: 'Canceled' }
];

export var ParticipantTypes = [
	{ ParticipantTypeId: 1, ParticipantTypeName: 'Person' },
	{ ParticipantTypeId: 2, ParticipantTypeName: 'Dealer' }
];

export var ParticipantSelectionTypes = [
	{ ParticipantSelectionTypeId: 1, ParticipantSelectionTypeName: 'Hierarchy' },
	{ ParticipantSelectionTypeId: 2, ParticipantSelectionTypeName: 'Searched List' },
	{ ParticipantSelectionTypeId: 3, ParticipantSelectionTypeName: 'Manually Entered List' },
	{ ParticipantSelectionTypeId: 4, ParticipantSelectionTypeName: 'Uploaded List' }
	//{ ParticipantSelectionTypeId: 5, ParticipantSelectionTypeName: 'External' }
];

// [TODO] Sub-selection controls: Hierarchies, Search data, Title (not for all types)

export var AwardTypes = [
	{ AwardTypeId: 1, AwardTypeName: 'Dollars' },
	{ AwardTypeId: 2, AwardTypeName: 'Points' },
	{ AwardTypeId: 3, AwardTypeName: 'Tokens' }
	//{ AwardTypeId: 4, AwardTypeName: 'Fixed Non-mon' }
];

export var FulfillmentTypes = [
	{ FulfillmentTypeId: 1, FulfillmentTypeName: 'Reloadable Card' },
	{ FulfillmentTypeId: 2, FulfillmentTypeName: 'Single-Issue Card' },
	{ FulfillmentTypeId: 3, FulfillmentTypeName: 'PayPal' },
	{ FulfillmentTypeId: 4, FulfillmentTypeName: 'Check' },
	{ FulfillmentTypeId: 5, FulfillmentTypeName: 'Credit Memo' },
	{ FulfillmentTypeId: 6, FulfillmentTypeName: 'Catalog' },
	{ FulfillmentTypeId: 7, FulfillmentTypeName: 'Spin -n- Win' },
	{ FulfillmentTypeId: 8, FulfillmentTypeName: 'Scratch Off' }
];

export var FulfillmentTypeMap: MockTypeMap[] = [
	{ id: 1, values: [1, 2, 3, 4, 5] },
	{ id: 2, values: [6] },
	{ id: 3, values: [7, 8] }
];

export var Promotions = [
	{
		PromotionId: 100, ShortName: 'Promotion A', LongName: 'Promotion A', PromotionStatusId: 3, PromotionStatusName: 'Approved',
		ParticipantTypeId: 1, ParticipantTypeName: 'Person',
		ParticipantSelectionTypeId: 1, ParticipantSelectionTypeName: 'Hierarchy',
		//DataStart: new Date('2018-09-01'), DataEnd: new Date('2018-09-30')
		DataStart: new Date(2018, 8, 1), DataEnd: new Date(2018, 8, 30), // Note: Month is zero-based
		AwardTypeId: 1, AwardTypeName: 'Dollars',
		FulfillmentTypeId: 1, FulfillmentTypeName: 'Reloadable Card'
	},
	{
		PromotionId: 101, ShortName: 'Promotion B', LongName: 'Promotion B', PromotionStatusId: 1, PromotionStatusName: 'Draft',
		//ParticipantTypeId: 1, ParticipantTypeName: 'Person',
		//ParticipantSelectionTypeId: 1, ParticipantSelectionTypeName: 'Hierarchy',
		ParticipantTypeId: 0, ParticipantTypeName: '',
		ParticipantSelectionTypeId: 0, ParticipantSelectionTypeName: '',
		//DataStart: new Date('2018-09-01'), DataEnd: new Date('2018-09-30')
		DataStart: new Date(2018, 8, 1), DataEnd: new Date(2018, 8, 30), // Note: Month is zero-based
		AwardTypeId: 0, AwardTypeName: null,
		FulfillmentTypeId: 0, FulfillmentTypeName: null
	},
	{
		PromotionId: 102, ShortName: 'Promotion C', LongName: 'Promotion C', PromotionStatusId: 3, PromotionStatusName: 'Approved',
		ParticipantTypeId: 1, ParticipantTypeName: 'Person',
		ParticipantSelectionTypeId: 1, ParticipantSelectionTypeName: 'Hierarchy',
		//DataStart: new Date('2018-09-01'), DataEnd: new Date('2018-09-30')
		DataStart: new Date(2018, 8, 1), DataEnd: new Date(2018, 8, 30), // Note: Month is zero-based
		AwardTypeId: 0, AwardTypeName: null,
		FulfillmentTypeId: 0, FulfillmentTypeName: null
	}

];

