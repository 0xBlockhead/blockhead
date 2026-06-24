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
			'operatorAddress',
		],
		content: {
			dl: [
				[
					'operatorAddress',
					'earningsReceiver',
					'delegationApprover',
					'stakerOptOutWindowBlocks',
					'metadataUri',
					'name',
					'website',
					'description',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'delegations',
					when: 'open',
					items: [
						'$$delegations',
					],
				},
				{
					label: 'allocations',
					when: 'open',
					items: [
						'$$allocations',
					],
				},
				{
					label: 'rewards',
					when: 'open',
					items: [
						'$$rewards',
					],
				},
				{
					label: 'slashing events',
					when: 'open',
					items: [
						'$$slashingEvents',
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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerOperator>
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
	entityType={EntityType.EigenLayerOperator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
