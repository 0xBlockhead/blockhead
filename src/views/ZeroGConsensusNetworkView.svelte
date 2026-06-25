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
		'consensusNetworkId',
		{
			label: 'latest staking status source',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'consensusNetworkId',
				{
					label: 'latest staking status source',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped staking-status source rows',
					},
				],
			},
			{
				label: 'DA quorums',
				items: [
					{
						label: 'quorum rows scoped to this consensus network',
					},
				],
			},
			{
				label: 'Storage proofs',
				items: [
					{
						label: 'public proof commitments linked to this consensus network',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent 0G network',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'da-quorums',
			label: 'da quorums',
			field: '$$daQuorums',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'storage-proofs',
			label: 'storage proofs',
			field: '$$storageProofs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGConsensusNetwork>
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
	entityType={EntityType.ZeroGConsensusNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
