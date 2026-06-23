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
				label: 'connection',
			},
			{
				label: 'observation time',
			},
			'health',
		],
		content: {
			dl: [
				[
					{
						label: 'connection',
					},
					{
						label: 'timestamp',
					},
					'source',
					'health',
				],
				[
					{
						label: 'latency',
					},
					{
						label: 'status code',
					},
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Connection',
					items: [
						{
							label: 'BlockheadAgentConnection',
						},
					],
				},
				{
					label: 'Probe',
					items: [
						{
							label: 'latency/status/error',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentConnection_Timestamp>
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
	entityType={EntityType.BlockheadAgentConnection_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
