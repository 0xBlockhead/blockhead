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
			'slot',
		],
		content: {
			dl: [
				[
					'slot',
					'epoch',
					'proposerIndex',
					'root',
					'parentRoot',
					'stateRoot',
					'bodyRoot',
					'canonical',
					'signature',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'beacon committees',
					when: 'open',
					items: [
						'$$beaconCommittees',
					],
				},
				{
					label: 'beacon attestations',
					when: 'open',
					items: [
						'$$beaconAttestations',
					],
				},
				{
					label: 'beacon withdrawals',
					when: 'open',
					items: [
						'$$beaconWithdrawals',
					],
				},
				{
					label: 'beacon slashings',
					when: 'open',
					items: [
						'$$beaconSlashings',
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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconSlot>
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
	entityType={EntityType.BeaconSlot}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
