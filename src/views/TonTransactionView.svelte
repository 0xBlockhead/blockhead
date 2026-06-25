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
		'$account',
		'lt',
		'hash',
	],
	content: {
		dl: [
			[
				'$account',
				'lt',
				'hash',
				{
					label: 'time',
				},
				{
					label: 'original/end status',
				},
			],
			[
				'transactionKind',
				{
					label: 'total fees',
				},
				'$block',
				{
					label: 'inbound message',
				},
				{
					label: 'outbound message count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Inbound message',
				items: [
					{
						label: 'inbound message edge',
					},
				],
			},
			{
				label: 'Outbound messages',
				items: [
					{
						label: 'outbound message edges',
					},
				],
			},
			{
				label: 'Execution phases',
				items: [
					{
						label: 'compute/storage/credit/action/bounce phases',
					},
				],
			},
			{
				label: 'Trace',
				items: [
					{
						label: 'containing trace graph',
					},
				],
			},
			{
				label: 'Previous transaction',
				items: [
					{
						label: 'previous account-local transaction',
					},
				],
			},
			{
				label: 'Asset effects',
				items: [
					{
						label: 'decoded jetton and NFT transfer effects',
					},
				],
			},
			{
				label: 'Raw cell/proof evidence',
				items: [
					{
						label: 'source payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'out-messages',
			label: 'out messages',
			field: '$$outMessages',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'phases',
			label: 'phases',
			field: '$$phases',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonTransaction>
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
	entityType={EntityType.TonTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
