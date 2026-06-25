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
			label: 'source quote id or source/request hash',
		},
		{
			label: 'from-chain -> to-chain ids',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'source quote id or source/request hash',
				},
				{
					label: 'from-chain -> to-chain ids',
				},
			],
			[
				'source',
				'timestampMs',
				{
					label: 'from/to EVM network refs',
				},
				{
					label: 'token addresses',
				},
				{
					label: 'from/to account addresses',
				},
			],
			[
				{
					label: 'request amount',
				},
				{
					label: 'quoted amount',
				},
				{
					label: 'minimum received',
				},
				'estimatedCostUsd',
				{
					label: 'ETA',
				},
			],
			[
				'approvalAddress',
				{
					label: 'transaction target',
				},
				'tags',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Steps',
				items: [
					{
						label: 'ordered quote step rows',
					},
				],
			},
			{
				label: 'Transaction request',
				items: [
					{
						label: 'transaction target',
					},
					{
						label: 'calldata hash',
					},
					'approvalAddress',
					{
						label: 'value/gas evidence when retained',
					},
				],
			},
			{
				label: 'Networks',
				items: [
					{
						label: 'from/to EVM network refs',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'LI.FI quote response',
					},
					{
						label: 'request parameters',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'steps',
			label: 'steps',
			field: '$$steps',
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
			selection: EntityProxyResource<typeof schema, EntityType.BridgeRouteQuote_Timestamp>
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
	entityType={EntityType.BridgeRouteQuote_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
