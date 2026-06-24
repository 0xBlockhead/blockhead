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
			'id',
		],
		content: {
			dl: [
				[
					'id',
					'name',
					'status',
					'createdAt',
					'updatedAt',
					'lockedAt',
					'simulationCount',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'actions',
					when: 'open',
					items: [
						'$$actions',
					],
				},
				{
					label: 'intent invocations',
					when: 'open',
					items: [
						'$$intentInvocations',
					],
				},
				{
					label: 'simulations',
					when: 'open',
					items: [
						'$$simulations',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSession>
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
	entityType={EntityType.BlockheadSession}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
