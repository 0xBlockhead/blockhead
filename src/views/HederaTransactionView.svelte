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
		'transactionType',
		'result',
		'consensusTimestamp',
	],
	content: {
		dl: [
			[
				'transactionType',
				'result',
				'consensusTimestamp',
				'transactionId',
				'nonce',
			],
			[
				{
					label: 'payer',
				},
				{
					label: 'node account',
				},
				{
					label: 'fee',
				},
				'scheduled',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'HBAR transfers',
				items: [
					{
						label: 'HBAR transfer effects',
					},
				],
			},
			{
				label: 'Token transfers',
				items: [
					{
						label: 'HTS token/NFT transfer effects',
					},
				],
			},
			{
				label: 'Contract result/actions/logs',
				items: [
					{
						label: 'contract execution result',
					},
					{
						label: 'actions',
					},
					{
						label: 'logs',
					},
				],
			},
			{
				label: 'Schedule',
				items: [
					{
						label: 'linked schedule when present',
					},
				],
			},
			{
				label: 'Child/duplicate records',
				items: [
					{
						label: 'child',
					},
					{
						label: 'duplicate transaction list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw transaction record',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'hbar-transfers',
			label: 'hbar transfers',
			field: '$$hbarTransfers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'token-transfers',
			label: 'token transfers',
			field: '$$tokenTransfers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'contract-results',
			label: 'contract results',
			field: '$$contractResults',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTransaction>
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
	entityType={EntityType.HederaTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
