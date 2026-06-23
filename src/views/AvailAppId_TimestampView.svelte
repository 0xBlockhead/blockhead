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
				label: 'app id',
			},
			{
				label: 'observation time',
			},
			{
				label: 'submission count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'app id',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'block number',
					},
					{
						label: 'data submission count',
					},
					{
						label: 'source-window submission count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'App id',
					items: [
						{
							label: 'parent app id',
						},
					],
				},
				{
					label: 'Submissions',
					items: [
						{
							label: 'data submission rows from the same source/window',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'indexer count/window payload',
						},
						{
							label: 'chain head or block context',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvailAppId_Timestamp>
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
	entityType={EntityType.AvailAppId_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
