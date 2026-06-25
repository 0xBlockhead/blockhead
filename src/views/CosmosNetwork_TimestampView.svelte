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
		'timestampMs',
		'source',
		{
			label: 'latest block height/hash/time',
		},
	],
	content: {
		dl: [
			[
				'timestampMs',
				'source',
				'latestBlockHeight',
				'latestBlockHash',
				'latestBlockTimeMs',
				{
					label: 'sync state',
				},
			],
			[
				'latestBlockTransactionCount',
				'chainId',
				{
					label: 'app/version',
				},
				'cosmosSdkVersion',
				{
					label: 'validator counts',
				},
				{
					label: 'bonded/not-bonded tokens',
				},
				'governanceProposalCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Head',
				items: [
					{
						label: 'latest block fields',
					},
				],
			},
			{
				label: 'App/node',
				items: [
					'chainId',
					'nodeNetwork',
					{
						label: 'app',
					},
					{
						label: 'SDK versions',
					},
					{
						label: 'sync',
					},
				],
			},
			{
				label: 'Staking',
				items: [
					{
						label: 'bounded validator counts',
					},
					{
						label: 'staking pool tokens',
					},
				],
			},
			{
				label: 'Governance',
				items: [
					{
						label: 'bounded proposal count',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'latest block',
					},
					{
						label: 'node_info',
					},
					{
						label: 'syncing',
					},
					{
						label: 'staking validators/pool',
					},
					{
						label: 'gov proposals',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosNetwork_Timestamp>
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
	entityType={EntityType.CosmosNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
