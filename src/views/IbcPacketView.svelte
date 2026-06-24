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
			label: 'channel',
		},
		'sequence',
		'direction',
	],
	content: {
		dl: [
			[
				{
					label: 'channel',
				},
				'sequence',
				'direction',
				'status',
				{
					label: 'source/destination port/channel',
				},
				{
					label: 'timeout',
				},
				{
					label: 'commitment hash',
				},
				{
					label: 'acknowledgement hash',
				},
				{
					label: 'receipt state',
				},
				{
					label: 'transaction hashes',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Lifecycle transactions',
				items: [
					{
						label: 'send',
					},
					{
						label: 'receive',
					},
					{
						label: 'acknowledge',
					},
					{
						label: 'timeout transaction refs or hashes',
					},
				],
			},
			{
				label: 'Commitment/receipt/ack',
				items: [
					{
						label: 'packet commitment',
					},
					{
						label: 'receipt',
					},
					{
						label: 'acknowledgement',
					},
					{
						label: 'unreceived packet',
					},
					{
						label: 'unreceived ack evidence',
					},
				],
			},
			{
				label: 'Transfer payload',
				items: [
					{
						label: 'data hash',
					},
					{
						label: 'denom trace',
					},
					{
						label: 'amount/receiver fields when decoded by source',
					},
				],
			},
			{
				label: 'Counterparty',
				items: [
					{
						label: 'source/destination channel context',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'SDK query',
					},
					{
						label: 'indexer event payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.IbcPacket>
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
	entityType={EntityType.IbcPacket}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
