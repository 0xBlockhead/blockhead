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
				label: 'builder',
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
						label: 'builder',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'delivered-payload count',
					},
					{
						label: 'delivered value',
					},
					{
						label: 'relay count',
					},
					{
						label: 'slot window',
					},
					{
						label: 'sample limit',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Builder',
					items: [
						{
							label: 'parent MEV builder',
						},
					],
				},
				{
					label: 'Delivered payloads',
					items: [
						{
							label: 'delivered-payload rows filtered to the same builder/window',
						},
					],
				},
				{
					label: 'Relays',
					items: [
						{
							label: 'relay hosts included in the observation',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'relay API parameters',
						},
						{
							label: 'pagination/limit',
						},
						{
							label: 'any aggregator freshness metadata',
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
			selection: EntityProxyResource<typeof schema, EntityType.MevBuilder_Timestamp>
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
	entityType={EntityType.MevBuilder_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
