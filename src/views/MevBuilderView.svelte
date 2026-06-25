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
			label: 'builder public key',
		},
		{
			label: 'latest delivered-payload count',
		},
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'builder public key',
				},
				{
					label: 'latest delivered-payload count',
				},
				{
					label: 'latest delivered value sum when available',
				},
				{
					label: 'delivered-payload row count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Delivered payloads',
				items: [
					{
						label: 'relay delivered-payload rows scoped by builder',
					},
				],
			},
			{
				label: 'Count snapshots',
				items: [
					{
						label: 'timestamped builder activity observations',
					},
				],
			},
			{
				label: 'Relays',
				items: [
					{
						label: 'relay hosts that have observed this builder',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent EVM network MEV-Boost section',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'relay bidtrace windows',
					},
					{
						label: 'pagination/limit context',
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
			id: 'delivered-payloads',
			label: 'delivered payloads',
			field: '$$deliveredPayloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.MevBuilder>
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
	entityType={EntityType.MevBuilder}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
