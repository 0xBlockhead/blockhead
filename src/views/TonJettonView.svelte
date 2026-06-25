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
		'masterAddress',
		'$masterAccount',
	],
	content: {
		dl: [
			[
				'$network',
				'masterAddress',
				'$masterAccount',
				{
					label: 'latest metadata/supply/admin observation',
				},
				{
					label: 'holder/balance/transfer windows',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Master account',
				items: [
					'$masterAccount',
				],
			},
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest jetton master observation',
					},
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'jetton master observation history',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'holder balance snapshots grouped by holder',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'decoded jetton transfer effects',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'contract classification when interface detection resolves',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'balance-timestamps',
			label: 'balance timestamps',
			field: '$$balanceTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'transfers',
			label: 'transfers',
			field: '$$transfers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonJetton>
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
	entityType={EntityType.TonJetton}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
