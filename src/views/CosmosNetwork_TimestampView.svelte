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
		{
			label: 'timestamp',
		},
		'source',
		{
			label: 'latest block height/hash/time',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'timestamp',
				},
				'source',
				{
					label: 'latest block height',
				},
				{
					label: 'latest block hash',
				},
				{
					label: 'latest block time',
				},
				{
					label: 'sync state',
				},
			],
			[
				{
					label: 'latest block transaction count',
				},
				{
					label: 'chain id',
				},
				{
					label: 'app/version',
				},
				{
					label: 'Cosmos SDK version',
				},
				{
					label: 'validator counts',
				},
				{
					label: 'bonded/not-bonded tokens',
				},
				{
					label: 'governance proposal count',
				},
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
					{
						label: 'chain id',
					},
					{
						label: 'node network',
					},
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
