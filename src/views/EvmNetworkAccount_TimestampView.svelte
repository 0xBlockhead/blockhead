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
		'$account',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$account',
				'timestampMs',
				'source',
				'blockNumber',
				{
					label: 'transaction/token/internal/NFT counts',
				},
			],
			[
				{
					label: 'first/last activity',
				},
				{
					label: 'contract flag',
				},
				{
					label: 'contract-position summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'parent EVM network account',
					},
				],
			},
			{
				label: 'Activity evidence',
				items: [
					{
						label: 'source counters',
					},
					{
						label: 'pagination ranges',
					},
				],
			},
			{
				label: 'Contract evidence',
				items: [
					{
						label: 'EVM contract when code/contract metadata resolves',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'actor coin balances observed near the same source time',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Blockscout address detail/counters',
					},
					{
						label: 'Etherscan account lists',
					},
					{
						label: 'Allium wallet snapshots',
					},
					{
						label: 'or RPC code/balance checks',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkAccount_Timestamp>
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
	entityType={EntityType.EvmNetworkAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
