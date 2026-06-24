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
			label: 'subnet',
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
					label: 'subnet',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'metagraph byte length',
				},
				{
					label: 'neuron count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Subnet',
				items: [
					{
						label: 'parent subnet',
					},
				],
			},
			{
				label: 'Neurons',
				items: [
					{
						label: 'neuron rows by uid when decoded',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'subnetInfo_getMetagraph payload',
					},
					{
						label: 'decoder/version context',
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
			selection: EntityProxyResource<typeof schema, EntityType.BittensorMetagraph_Timestamp>
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
	entityType={EntityType.BittensorMetagraph_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
