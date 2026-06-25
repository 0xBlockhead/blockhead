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
		'proposalId',
		'title',
		{
			label: 'latest lifecycle status',
		},
	],
	content: {
		dl: [
			[
				'proposalId',
				'title',
				'summary',
				{
					label: 'metadata presence',
				},
			],
			[
				{
					label: 'latest lifecycle status',
				},
				{
					label: 'latest tally summary',
				},
				'$$deposits',
				'$$votes',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Lifecycle snapshots',
				items: [
					{
						label: 'timestamped proposal lifecycle observations',
					},
				],
			},
			{
				label: 'Messages',
				items: [
					{
						label: 'executable SDK messages',
					},
				],
			},
			{
				label: 'Deposits',
				items: [
					{
						label: 'proposal depositor/denom records with timestamped amounts',
					},
				],
			},
			{
				label: 'Votes',
				items: [
					{
						label: 'proposal voter records with timestamped choices',
					},
				],
			},
			{
				label: 'Tally snapshots',
				items: [
					{
						label: 'timestamped live/final tally observations',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'rendered/raw metadata',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Cosmos network',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'messages',
			label: 'messages',
			field: '$$messages',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'deposits',
			label: 'deposits',
			field: '$$deposits',
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
			id: 'tallies',
			label: 'tallies',
			field: '$$tallies',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosGovernanceProposal>
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
	entityType={EntityType.CosmosGovernanceProposal}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
