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
		'hash',
		'blockSlot',
		'fee',
	],
	content: {
		dl: [
			[
				'hash',
				'blockSlot',
				'fee',
				'deposit',
				'sizeBytes',
			],
			[
				{
					label: 'validity interval',
				},
				'$$inputs',
				'$$outputs',
				'$$certificates',
				{
					label: 'script witness count',
				},
			],
			[
				'$$governanceProposals',
				{
					label: 'vote count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Inputs',
				items: [
					{
						label: 'transaction input rows',
					},
				],
			},
			{
				label: 'Outputs',
				items: [
					{
						label: 'transaction output rows',
					},
				],
			},
			{
				label: 'Certificates',
				items: [
					{
						label: 'transaction-carried certificate effects',
					},
				],
			},
			{
				label: 'Script witnesses',
				items: [
					{
						label: 'transaction-scoped script witnesses',
					},
				],
			},
			{
				label: 'Governance',
				items: [
					{
						label: 'governance proposals and votes carried by the transaction',
					},
				],
			},
			{
				label: 'Native assets',
				items: [
					{
						label: 'native assets referenced by input/output bundles',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'structured transaction metadata/status',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'inputs',
			label: 'inputs',
			field: '$$inputs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'outputs',
			label: 'outputs',
			field: '$$outputs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'certificates',
			label: 'certificates',
			field: '$$certificates',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'scripts',
			label: 'scripts',
			field: '$$scripts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'governance-proposals',
			label: 'governance proposals',
			field: '$$governanceProposals',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'governance-votes',
			label: 'governance votes',
			field: '$$governanceVotes',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'assets',
			label: 'assets',
			field: '$$assets',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoTransaction>
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
	entityType={EntityType.CardanoTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
