<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		'accountId',
		{
			label: 'latest balance/storage/code summary',
		},
		{
			label: 'contract link when latest code observation indicates deployed code',
		},
	],
	content: {
		dl: [
			[
				'accountId',
				{
					label: 'latest balance/storage/code summary',
				},
				{
					label: 'contract link when latest code observation indicates deployed code',
				},
				'$$accessKeys',
				{
					label: 'latest observation time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State observations',
				items: [
					{
						label: 'timestamped account balance/storage/code observations',
					},
				],
			},
			{
				label: 'Access keys',
				items: [
					{
						label: 'access-key rows for this account',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'account-scoped contract code state',
					},
				],
			},
			{
				label: 'Transactions/receipts',
				items: [
					{
						label: 'transactions and receipts when indexed',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'RPC/indexer payload freshness',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'access-keys',
			label: 'access keys',
			field: '$$accessKeys',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NearAccount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.NearAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
