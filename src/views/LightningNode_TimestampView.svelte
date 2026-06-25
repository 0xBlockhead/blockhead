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
		'$node',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$node',
				'timestampMs',
				'source',
				'alias',
				'color',
			],
			[
				'capacitySats',
				'channelCount',
				'firstSeenMs',
				'updatedAtMs',
				{
					label: 'country',
				},
			],
			[
				'city',
				{
					label: 'advertised address count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Node',
				items: [
					{
						label: 'parent Lightning node',
					},
				],
			},
			{
				label: 'Channels',
				items: [
					{
						label: 'channels in the same source slice when available',
					},
				],
			},
			{
				label: 'Location',
				items: [
					{
						label: 'country/city/source labels',
					},
				],
			},
			{
				label: 'Addresses',
				items: [
					{
						label: 'advertised socket list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'public graph node or LND getinfo payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningNode_Timestamp>
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
	entityType={EntityType.LightningNode_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
