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
			label: 'transaction key',
		},
		'hash',
		'$signer',
	],
	content: {
		dl: [
			[
				{
					label: 'transaction key',
				},
				'hash',
				'$signer',
				'$receiver',
				'nonce',
			],
			[
				'$$actions',
				{
					label: 'outcome count',
				},
				{
					label: 'status when available',
				},
				{
					label: 'chunk/block context',
				},
				{
					label: 'source evidence',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Accounts',
				items: [
					{
						label: 'signer NearAccount',
					},
					{
						label: 'receiver NearAccount',
					},
				],
			},
			{
				label: 'Actions',
				items: [
					{
						label: 'NearAction list',
					},
				],
			},
			{
				label: 'Execution',
				items: [
					{
						label: 'NearExecutionOutcome list',
					},
					{
						label: 'NearReceipt list',
					},
				],
			},
			{
				label: 'Block/chunk',
				items: [
					{
						label: 'NearBlock/NearChunk context when resolved',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'RPC tx/status hash+sender lookup',
					},
					{
						label: 'indexer hash lookup',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'NEAR RPC transaction status/indexer payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'actions',
			label: 'actions',
			field: '$$actions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'execution-outcomes',
			label: 'execution outcomes',
			field: '$$executionOutcomes',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearTransaction>
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
	entityType={EntityType.NearTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
