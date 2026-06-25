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
		{
			label: 'block number/hash',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'blockNumber',
				'hash',
				'$parent',
				'stateRoot',
			],
			[
				'extrinsicsRoot',
				'$$extrinsics',
				'$$events',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Extrinsics',
				items: [
					{
						label: 'extrinsics in this block',
					},
				],
			},
			{
				label: 'Events',
				items: [
					{
						label: 'events in this block',
					},
				],
			},
			{
				label: 'Parent',
				items: [
					{
						label: 'parent Polkadot block',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'chain_getBlockHash number lookup',
					},
					{
						label: 'chain_getBlock hash lookup',
					},
					{
						label: 'indexer block payload fields',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'extrinsics',
			label: 'extrinsics',
			field: '$$extrinsics',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'events',
			label: 'events',
			field: '$$events',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotBlock>
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
	entityType={EntityType.PolkadotBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
