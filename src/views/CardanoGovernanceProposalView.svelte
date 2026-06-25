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
			label: 'proposal transaction hash',
		},
		'proposalIndex',
		'proposalKind',
	],
	content: {
		dl: [
			[
				{
					label: 'proposal transaction hash',
				},
				'proposalIndex',
				'proposalKind',
				'depositLovelace',
				'returnAddress',
			],
			[
				{
					label: 'anchor URL/hash',
				},
				'$$votes',
				{
					label: 'latest ratification state',
				},
				{
					label: 'latest lifecycle epoch',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'proposal-bearing Cardano transaction',
					},
				],
			},
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped governance proposal state observations',
					},
				],
			},
			{
				label: 'Votes',
				items: [
					{
						label: 'governance votes on this proposal',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'governance action JSON/CBOR fields',
					},
				],
			},
			{
				label: 'Anchor',
				items: [
					{
						label: 'off-chain anchor metadata evidence',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Cardano network',
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
			id: 'votes',
			label: 'votes',
			field: '$$votes',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoGovernanceProposal>
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
	entityType={EntityType.CardanoGovernanceProposal}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
