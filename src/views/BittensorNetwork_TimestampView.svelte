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
		'$network',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$network',
				'timestampMs',
				'source',
				{
					label: 'finalized block number/hash',
				},
				{
					label: 'runtime spec/impl versions',
				},
			],
			[
				'peerCount',
				{
					label: 'sync flags',
				},
				'subnetCount',
				'subnetsInfoByteLength',
				'dynamicInfoByteLength',
			],
			[
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
					'$network',
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
					'peerCount',
					{
						label: 'sync flags',
					},
				],
			},
			{
				label: 'Subnet payloads',
				items: [
					'subnetCount',
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
