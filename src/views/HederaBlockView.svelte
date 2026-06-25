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
		'blockNumber',
		'blockHash',
	],
	content: {
		dl: [
			[
				'$network',
				'blockNumber',
				'blockHash',
				{
					label: 'consensus start/end',
				},
				'gasUsed',
				{
					label: 'record file',
				},
				'transactionCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transactions',
				items: [
					{
						label: 'Hedera transactions in this block range',
					},
				],
			},
			{
				label: 'Record file',
				items: [
					{
						label: 'record-file metadata',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'mirror block lookup by number or hash',
					},
					{
						label: 'mirror/explorer block payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaBlock>
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
	entityType={EntityType.HederaBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
