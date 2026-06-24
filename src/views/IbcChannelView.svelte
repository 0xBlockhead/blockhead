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
			label: 'network',
		},
		{
			label: 'port id',
		},
		{
			label: 'channel id',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'port id',
				},
				{
					label: 'channel id',
				},
				'state',
				'ordering',
				'version',
				{
					label: 'connection',
				},
				{
					label: 'client',
				},
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
