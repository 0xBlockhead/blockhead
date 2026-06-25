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
		'contractAddress',
		'tokenId',
	],
	content: {
		dl: [
			[
				'$network',
				'contractAddress',
				'tokenId',
				'standard',
				'$contract',
			],
			[
				{
					label: 'latest name/symbol/decimals',
				},
				{
					label: 'latest media URI availability',
				},
				{
					label: 'latest supply',
				},
				{
					label: 'holder count',
				},
				'$$transfers',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contract',
				items: [
					{
						label: 'parent Tezos contract',
					},
				],
			},
			{
				label: 'Metadata/history',
				items: [
					{
						label: 'level/source token metadata observations',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'token balance observations grouped by holder',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'token transfer rows',
					},
				],
			},
			{
				label: 'Ledger storage',
				items: [
					{
						label: 'big-map rows for ledger/token_metadata big maps when resolved',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.TezosToken>
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
	entityType={EntityType.TezosToken}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
