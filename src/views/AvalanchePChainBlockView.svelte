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
			label: 'height/block id',
		},
		'timestampMs',
	],
	content: {
		dl: [
			[
				'$network',
				'height',
				'blockId',
				'parentBlockId',
				'timestampMs',
				'encoding',
				'$$transactions',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transactions',
				items: [
					{
						label: 'P-Chain transactions in this block',
					},
				],
			},
			{
				label: 'Parent',
				items: [
					{
						label: 'parent P-Chain block when resolved',
					},
				],
			},
			{
				label: 'Raw block',
				items: [
					{
						label: 'JSON/hex block payload',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'platform.getBlock blockID lookup',
					},
					{
						label: 'platform.getBlockByHeight height lookup',
					},
				],
			},
			{
				label: 'Network',
				items: [
					'$network',
				],
			},
		],
	},
	lists: [
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
			selection: EntityProxyResource<typeof schema, EntityType.AvalanchePChainBlock>
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
	entityType={EntityType.AvalanchePChainBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
