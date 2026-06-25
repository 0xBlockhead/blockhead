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
		'$turn',
		'callIndex',
		{
			label: 'operation/status',
		},
	],
	content: {
		dl: [
			[
				'$turn',
				'callIndex',
				'$connection',
				'$provider',
				'$model',
				'$operation',
			],
			[
				{
					label: 'provider request/response ids',
				},
				{
					label: 'started/completed at',
				},
				'status',
				{
					label: 'tokens',
				},
				'cost',
				'latencyMs',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Turn',
				items: [
					{
						label: 'BlockheadAgentConversationTurn',
					},
				],
			},
			{
				label: 'Provider refs',
				items: [
					{
						label: 'AiModelProvider',
					},
					{
						label: 'AiModel',
					},
					{
						label: 'AiProviderApiOperation',
					},
				],
			},
			{
				label: 'Hashes',
				items: [
					{
						label: 'request/response hash algorithms and hashes',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentProviderCall>
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
	entityType={EntityType.BlockheadAgentProviderCall}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
