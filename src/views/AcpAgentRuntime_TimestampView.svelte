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
			label: 'runtime',
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
					label: 'runtime',
				},
				{
					label: 'timestamp',
				},
				'source',
				'health',
				{
					label: 'protocol version',
				},
			],
			[
				{
					label: 'agent/client info',
				},
				{
					label: 'auth methods',
				},
				{
					label: 'agent capabilities',
				},
				{
					label: 'client capabilities',
				},
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Runtime',
				items: [
					{
						label: 'AcpAgentRuntime',
					},
				],
			},
			{
				label: 'Capabilities',
				items: [
					{
						label: 'protocol/capability/auth payloads',
					},
				],
			},
			{
				label: 'Errors',
				items: [
					{
						label: 'error field',
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpAgentRuntime_Timestamp>
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
	entityType={EntityType.AcpAgentRuntime_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
