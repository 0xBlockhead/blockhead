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
		'digest',
		'transactionKind',
		'sender',
	],
	content: {
		dl: [
			[
				'digest',
				'transactionKind',
				'sender',
				{
					label: 'latest status',
				},
				{
					label: 'latest checkpoint',
				},
				'$$timestamps',
				{
					label: 'latest gas budget/price',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest execution',
				items: [
					{
						label: 'latest checkpoint/source execution observation',
					},
				],
			},
			{
				label: 'Execution history',
				items: [
					{
						label: 'timestamped transaction execution observations',
					},
				],
			},
			{
				label: 'Commands',
				items: [
					{
						label: 'programmable transaction commands',
					},
				],
			},
			{
				label: 'Object changes',
				items: [
					{
						label: 'object effect rows',
					},
				],
			},
			{
				label: 'Balance changes',
				items: [
					{
						label: 'balance delta rows',
					},
				],
			},
			{
				label: 'Events',
				items: [
					{
						label: 'Sui event rows',
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
			id: 'commands',
			label: 'commands',
			field: '$$commands',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'object-changes',
			label: 'object changes',
			field: '$$objectChanges',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'balance-changes',
			label: 'balance changes',
			field: '$$balanceChanges',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'events',
			label: 'events',
			field: '$$events',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiTransaction>
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
	entityType={EntityType.SuiTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
