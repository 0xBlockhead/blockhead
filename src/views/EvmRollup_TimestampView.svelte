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
			label: 'rollup',
		},
		{
			label: 'observation time',
		},
		{
			label: 'source status',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'rollup',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'archived/upcoming/under-review flags',
				},
				{
					label: 'listing stage',
				},
				{
					label: 'source updated time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Rollup',
				items: [
					{
						label: 'parent L2Beat compatibility row',
					},
				],
			},
			{
				label: 'Status flags',
				items: [
					{
						label: 'archived',
					},
					{
						label: 'upcoming',
					},
					{
						label: 'under review',
					},
					{
						label: 'listing stage',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'L2Beat project payload',
					},
					{
						label: 'catalog freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmRollup_Timestamp>
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
	entityType={EntityType.EvmRollup_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
