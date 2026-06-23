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
				label: 'channel',
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
						label: 'channel',
					},
					{
						label: 'observation time',
					},
					'source',
					'status',
					{
						label: 'capacity',
					},
					{
						label: 'fee rate',
					},
					{
						label: 'updated time',
					},
					{
						label: 'closing transaction',
					},
					{
						label: 'closing fee',
					},
					{
						label: 'closing reason',
					},
					{
						label: 'closed time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Channel',
					items: [
						{
							label: 'parent Lightning channel',
						},
					],
				},
				{
					label: 'Nodes',
					items: [
						{
							label: 'node endpoints through the channel',
						},
					],
				},
				{
					label: 'Closing',
					items: [
						{
							label: 'closing transaction/reason/fee fields',
						},
					],
				},
				{
					label: 'Local state',
					items: [
						{
							label: 'BlockheadLightningChannelState when the same source is a connected node',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'public graph channel or LND channel payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningChannel_Timestamp>
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
	entityType={EntityType.LightningChannel_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
