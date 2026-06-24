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
			label: 'transaction',
		},
		{
			label: 'observation time',
		},
		'status',
	],
	content: {
		dl: [
			[
				{
					label: 'transaction',
				},
				{
					label: 'observation time',
				},
				'source',
				'status',
				{
					label: 'block height',
				},
				{
					label: 'block id',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent P-Chain transaction',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'P-Chain block when block id/height resolves',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'PlatformVM transaction/status payload',
					},
					{
						label: 'Avascan indexer status',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvalanchePChainTransaction_Timestamp>
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
	entityType={EntityType.AvalanchePChainTransaction_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
