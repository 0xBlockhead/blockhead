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
			label: 'topic',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'topic',
				},
				{
					label: 'observation time',
				},
				'source',
				'reachable',
			],
			[
				{
					label: 'candidate signatures',
				},
				{
					label: 'filtered signature count',
				},
				{
					label: 'verified candidate count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Topic',
				items: [
					{
						label: 'parent EvmTopic hash row',
					},
				],
			},
			{
				label: 'Candidates',
				items: [
					{
						label: 'candidate event signatures',
					},
					{
						label: 'ambiguity warnings',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Openchain event-signature lookup response',
					},
					{
						label: 'fallback catalog behavior',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmTopic_Timestamp>
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
	entityType={EntityType.EvmTopic_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
