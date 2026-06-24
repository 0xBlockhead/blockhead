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
			label: 'vault contract',
		},
		{
			label: 'network',
		},
		{
			label: 'asset',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'vault contract',
				},
				{
					label: 'network',
				},
				{
					label: 'asset',
				},
				{
					label: 'share token',
				},
				'name',
				'symbol',
				'decimals',
				{
					label: 'latest total assets',
				},
				{
					label: 'latest total supply',
				},
				{
					label: 'latest APY/TVL observation when present',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Asset',
				items: [
					{
						label: 'underlying EVM coin instance',
					},
				],
			},
			{
				label: 'Share token',
				items: [
					{
						label: 'share-token EVM coin instance',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'vault EVM contract with ABI/source verification',
					},
				],
			},
			{
				label: 'On-chain state',
				items: [
					{
						label: 'block-bounded ERC-4626 contract-call observations',
					},
				],
			},
			{
				label: 'Yield observations',
				items: [
					{
						label: 'timestamped off-chain APY/TVL observations',
					},
				],
			},
			{
				label: 'Related positions',
				items: [
					{
						label: 'protocol-specific position rows when indexer sources expose them',
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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4626Vault>
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
	entityType={EntityType.Erc4626Vault}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
