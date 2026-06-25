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
			label: 'head block',
		},
		{
			label: 'environment',
		},
		{
			label: 'native asset count',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'head block',
				},
				{
					label: 'environment',
				},
				{
					label: 'native asset count',
				},
				{
					label: 'runtime asset count',
				},
				'$$validators',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Blocks',
				items: [
					{
						label: 'Polkadot block rows',
					},
				],
			},
			{
				label: 'Runtime snapshots',
				items: [
					{
						label: 'timestamped finalized-head/runtime observations',
					},
				],
			},
			{
				label: 'Validators',
				items: [
					{
						label: 'Polkadot validator rows',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'native coin plus bounded runtime/indexer asset rows',
					},
				],
			},
			{
				label: 'Asset balances',
				items: [
					{
						label: 'asset balance observations',
					},
				],
			},
			{
				label: 'Endpoints',
				items: [
					{
						label: 'network transport endpoints',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'faucet and block explorer URLs',
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
			id: 'assets',
			label: 'assets',
			field: '$$assets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'asset-balance-timestamps',
			label: 'asset balance timestamps',
			field: '$$assetBalanceTimestamps',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotNetwork>
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
	entityType={EntityType.PolkadotNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
