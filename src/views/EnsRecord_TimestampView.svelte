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
				label: 'record',
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
						label: 'record',
					},
					{
						label: 'observation time',
					},
					'source',
					'value',
					{
						label: 'resolver selector',
					},
					{
						label: 'block number',
					},
					{
						label: 'decoded display value',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Record',
					items: [
						{
							label: 'parent ENS record',
						},
					],
				},
				{
					label: 'Name',
					items: [
						{
							label: 'parent ENS name',
						},
					],
				},
				{
					label: 'Raw call/event',
					items: [
						{
							label: 'resolver calldata',
						},
						{
							label: 'event id',
						},
						{
							label: 'or subgraph cursor when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.EnsRecord_Timestamp>
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
	entityType={EntityType.EnsRecord_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
