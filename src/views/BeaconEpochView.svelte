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
			label: 'epoch number',
		},
		{
			label: 'slot range',
		},
		{
			label: 'finalized status',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'epoch number',
				},
				'startSlot',
				'endSlot',
				'slotCount',
				{
					label: 'finalized status',
				},
			],
			[
				'globalParticipationRate',
				{
					label: 'validator count',
				},
				{
					label: 'attestation count',
				},
				{
					label: 'withdrawal count',
				},
				{
					label: 'attester slashing count',
				},
				{
					label: 'proposer slashing count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Slots',
				items: [
					{
						label: 'beacon slots in the epoch range',
					},
				],
			},
			{
				label: 'Epoch stats',
				items: [
					{
						label: 'Beaconcha.in epoch overview fields keyed by epoch',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent EVM network consensus context',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Beacon REST slot math/list expansion',
					},
					{
						label: 'Beaconcha.in /epoch/{epoch} payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'beacon-slots',
			label: 'beacon slots',
			field: '$$beaconSlots',
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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconEpoch>
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
	entityType={EntityType.BeaconEpoch}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
