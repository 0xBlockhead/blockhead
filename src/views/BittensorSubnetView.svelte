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
			label: 'network',
		},
		'netuid',
		'name',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				'netuid',
				'name',
				{
					label: 'subnet-info byte length',
				},
				{
					label: 'dynamic-info byte length',
				},
				{
					label: 'hyperparams byte length',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Payload summaries',
				items: [
					{
						label: 'subnetInfo_getSubnetInfo byte length',
					},
					{
						label: 'subnetInfo_getDynamicInfo byte length',
					},
					{
						label: 'subnetInfo_getSubnetHyperparams byte length',
					},
				],
			},
			{
				label: 'Metagraph snapshots',
				items: [
					{
						label: 'timestamped metagraph payload observations',
					},
				],
			},
			{
				label: 'Neurons',
				items: [
					{
						label: 'neuron rows by uid',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Bittensor network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Bittensor JSON-RPC SCALE payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.BittensorSubnet>
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
	entityType={EntityType.BittensorSubnet}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
