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
		'$service',
		'timestampMs',
		'health',
	],
	content: {
		dl: [
			[
				'$service',
				'timestampMs',
				'source',
				'health',
				'reachable',
			],
			[
				'protocolVersion',
				'latencyMs',
				'statusCode',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Service',
				items: [
					{
						label: 'A2aAgentService',
					},
				],
			},
			{
				label: 'Probe',
				items: [
					{
						label: 'reachability/latency/status/error',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentService_Timestamp>
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
	entityType={EntityType.A2aAgentService_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
