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
		'$builder',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$builder',
				'timestampMs',
				'source',
				'deliveredPayloadCount',
				{
					label: 'delivered value',
				},
			],
			[
				'relayCount',
				{
					label: 'slot window',
				},
				'sampleLimit',
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
