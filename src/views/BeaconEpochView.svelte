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
			'epoch',
		],
		content: {
			dl: [
				[
					'epoch',
					'startSlot',
					'endSlot',
					'slotCount',
					'finalized',
					'globalParticipationRate',
					'validatorsCount',
					'attestationsCount',
					'attesterSlashingsCount',
					'proposerSlashingsCount',
					'withdrawalsCount',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'beacon slots',
					when: 'open',
					items: [
						'$$beaconSlots',
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
