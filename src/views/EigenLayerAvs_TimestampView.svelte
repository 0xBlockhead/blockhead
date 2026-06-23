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
				label: 'AVS',
			},
			{
				label: 'observation time',
			},
			{
				label: 'operator count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'AVS',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'block number',
					},
					{
						label: 'operator count',
					},
					{
						label: 'strategy count',
					},
					{
						label: 'registration status',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'AVS',
					items: [
						{
							label: 'parent EigenLayer AVS',
						},
					],
				},
				{
					label: 'Operators',
					items: [
						{
							label: 'operator rows for the same source/window when available',
						},
					],
				},
				{
					label: 'Allocations',
					items: [
						{
							label: 'allocation observations near the same observation',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'AVSDirectory reads/logs',
						},
						{
							label: 'subgraph/indexer aggregate payload',
						},
						{
							label: 'block context',
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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerAvs_Timestamp>
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
	entityType={EntityType.EigenLayerAvs_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
