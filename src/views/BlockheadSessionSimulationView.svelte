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
					'status',
					'createdAt',
					'completedAt',
					'paramsHash',
					'forkBlockNumber',
					'forkRpcOrigin',
					'actionCount',
					'gasUsed',
					'resultSummary',
					'resultPayloadHash',
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'calls',
					when: 'open',
					items: [
						'$$calls',
					],
				},
				{
					label: 'logs',
					when: 'open',
					items: [
						'$$logs',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSessionSimulation>
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
	entityType={EntityType.BlockheadSessionSimulation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
