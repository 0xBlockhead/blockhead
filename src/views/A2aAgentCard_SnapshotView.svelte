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
			'contentHashAlgorithm',
			'contentHash',
		],
		content: {
			dl: [
				[
					'contentHashAlgorithm',
					'contentHash',
					'fetchedAt',
					'snapshotKind',
					'name',
					'description',
					'version',
					'protocolVersion',
					'providerName',
					'providerUrl',
					'preferredTransport',
					'defaultInputModes',
					'defaultOutputModes',
					'capabilities',
					'extensions',
					'securitySchemes',
					'security',
					'signatures',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'interfaces',
					when: 'open',
					items: [
						'$$interfaces',
					],
				},
				{
					label: 'services',
					when: 'open',
					items: [
						'$$services',
					],
				},
				{
					label: 'skills',
					when: 'open',
					items: [
						'$$skills',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentCard_Snapshot>
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
	entityType={EntityType.A2aAgentCard_Snapshot}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
