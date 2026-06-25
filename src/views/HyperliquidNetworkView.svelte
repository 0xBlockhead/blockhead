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
			label: 'head HyperEVM block',
		},
		{
			label: 'environment',
		},
		{
			label: 'stack',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'head HyperEVM block',
				},
				{
					label: 'environment',
				},
				{
					label: 'stack',
				},
				{
					label: 'endpoint availability',
				},
				{
					label: 'latest perp market count',
				},
			],
			[
				{
					label: 'latest spot asset count',
				},
				{
					label: 'latest spot pair count',
				},
				{
					label: 'latest validator count',
				},
				{
					label: 'latest vault count when sourced',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Execution',
				items: [
					'$$blocks',
					'$$transactions',
					{
						label: 'network snapshots',
					},
					'$$validators',
					{
						label: 'endpoints',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'native coin',
					},
					'$$perpMarkets',
					'$$spotAssets',
					'$$spotPairs',
				],
			},
			{
				label: 'Vaults',
				items: [
					{
						label: 'Hyperliquid vault rows',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'faucets',
					},
					{
						label: 'block explorers',
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
			id: 'blocks',
			label: 'blocks',
			field: '$$blocks',
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
		{
			id: 'validators',
			label: 'validators',
			field: '$$validators',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'spot-assets',
			label: 'spot assets',
			field: '$$spotAssets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'spot-pairs',
			label: 'spot pairs',
			field: '$$spotPairs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'perp-markets',
			label: 'perp markets',
			field: '$$perpMarkets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'vaults',
			label: 'vaults',
			field: '$$vaults',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidNetwork>
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
	entityType={EntityType.HyperliquidNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
