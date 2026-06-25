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
		'$network',
		'address',
		'name',
	],
	content: {
		dl: [
			[
				'$network',
				'address',
				'name',
				'$contract',
				{
					label: 'latest balance/resource/activity summary',
				},
				{
					label: 'token-balance snapshot count',
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
						label: 'account/resource snapshots',
					},
				],
			},
			{
				label: 'Token balances',
				items: [
					{
						label: 'token balance snapshots grouped by token',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'TRON transactions',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'contract identity when the latest snapshot or source ref marks it as a contract',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent TRON network',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'token-balance-timestamps',
			label: 'token balance timestamps',
			field: '$$tokenBalanceTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronAccount>
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
	entityType={EntityType.TronAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
