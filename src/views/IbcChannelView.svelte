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
		'portId',
		'channelId',
	],
	content: {
		dl: [
			[
				'$network',
				'portId',
				'channelId',
				'state',
				'ordering',
			],
			[
				'version',
				'$connection',
				'$client',
				{
					label: 'next send/receive sequence',
				},
				{
					label: 'counterparty ids',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Packets',
				items: [
					{
						label: 'packet rows grouped by lifecycle status',
					},
				],
			},
			{
				label: 'Connection/client',
				items: [
					{
						label: 'linked IBC connection',
					},
					{
						label: 'linked IBC client',
					},
				],
			},
			{
				label: 'Counterparty',
				items: [
					{
						label: 'counterparty network/channel refs',
					},
					{
						label: 'registry/indexer claims',
					},
				],
			},
			{
				label: 'Sequence state',
				items: [
					{
						label: 'next send/receive sequence',
					},
					{
						label: 'unreceived packet/ack summaries',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'channel',
					},
					{
						label: 'channel client-state',
					},
					{
						label: 'sequence query payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'packets',
			label: 'packets',
			field: '$$packets',
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
			selection: EntityProxyResource<typeof schema, EntityType.IbcChannel>
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
	entityType={EntityType.IbcChannel}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
