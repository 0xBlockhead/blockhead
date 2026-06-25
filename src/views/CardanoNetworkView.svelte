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
		{
			label: 'latest era',
		},
		{
			label: 'latest slot/block/epoch snapshot',
		},
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'latest era',
				},
				{
					label: 'latest slot/block/epoch snapshot',
				},
				{
					label: 'sync progress',
				},
				{
					label: 'native ADA asset',
				},
			],
			[
				'$$dReps',
				'$$governanceProposals',
				'$$stakePools',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Blocks',
				items: [
					{
						label: 'Cardano blocks',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Cardano transactions',
					},
				],
			},
			{
				label: 'Addresses',
				items: [
					{
						label: 'Cardano addresses',
					},
				],
			},
			{
				label: 'Stake credentials',
				items: [
					{
						label: 'Cardano stake credentials',
					},
				],
			},
			{
				label: 'Stake pools',
				items: [
					{
						label: 'Cardano stake pools',
					},
				],
			},
			{
				label: 'Governance',
				items: [
					'$$dReps',
					'$$governanceProposals',
					{
						label: 'committee epoch observations',
					},
					{
						label: 'constitution epoch observations',
					},
				],
			},
			{
				label: 'Native assets',
				items: [
					{
						label: 'Cardano native assets',
					},
				],
			},
			{
				label: 'Protocol parameters',
				items: [
					{
						label: 'epoch-bounded protocol parameter rows',
					},
				],
			},
			{
				label: 'Network snapshots',
				items: [
					{
						label: 'timestamped network tip/sync observations',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'blocks',
			label: 'blocks',
			field: '$$blocks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'addresses',
			label: 'addresses',
			field: '$$addresses',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'stake-credentials',
			label: 'stake credentials',
			field: '$$stakeCredentials',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'stake-pools',
			label: 'stake pools',
			field: '$$stakePools',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'd-reps',
			label: 'd reps',
			field: '$$dReps',
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
			id: 'assets',
			label: 'assets',
			field: '$$assets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'protocol-parameter-epochs',
			label: 'protocol parameter epochs',
			field: '$$protocolParameterEpochs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'constitution-epochs',
			label: 'constitution epochs',
			field: '$$constitutionEpochs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'committee-epochs',
			label: 'committee epochs',
			field: '$$committeeEpochs',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.CardanoNetwork>
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
	entityType={EntityType.CardanoNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
