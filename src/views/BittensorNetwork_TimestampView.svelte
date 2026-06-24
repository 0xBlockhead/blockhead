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
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'finalized block number/hash',
				},
				{
					label: 'runtime spec/impl versions',
				},
				{
					label: 'peer count',
				},
				{
					label: 'sync flags',
				},
				{
					label: 'subnet count',
				},
				{
					label: 'SubnetsInfo byte length',
				},
				{
					label: 'DynamicInfo byte length',
				},
				{
					label: 'metagraph byte length',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'Network',
					},
				],
			},
			{
				label: 'Finality/runtime',
				items: [
					{
						label: 'finalized block number/hash',
					},
					{
						label: 'runtime spec/impl versions',
					},
				],
			},
			{
				label: 'Node health',
				items: [
					{
						label: 'peer count',
					},
					{
						label: 'sync flags',
					},
				],
			},
			{
				label: 'Subnet payloads',
				items: [
					{
						label: 'subnet count',
					},
					{
						label: 'SubnetsInfo/DynamicInfo/metagraph byte lengths',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Bittensor JSON-RPC responses',
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
			selection: EntityProxyResource<typeof schema, EntityType.BittensorNetwork_Timestamp>
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
	entityType={EntityType.BittensorNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
