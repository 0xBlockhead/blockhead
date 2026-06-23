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
				label: 'network',
			},
			{
				label: 'observation time',
			},
			'source',
			'status',
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'timestamp',
					},
					'source',
					'status',
					'error',
				],
				[
					{
						label: 'scoped agent/registration/server counts',
					},
					{
						label: 'endpoint reachability',
					},
					{
						label: 'cursor',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: '_GlobalAgentNetwork',
						},
					],
				},
				{
					label: 'Discovery windows',
					items: [
						{
							label: 'query hash algorithm/hash',
						},
						{
							label: 'cursor',
						},
						{
							label: 'search result count',
						},
					],
				},
				{
					label: 'Source health',
					items: [
						{
							label: 'reachable endpoint count',
						},
						{
							label: 'rate limit',
						},
						'error',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAgentNetwork_Timestamp>
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
	entityType={EntityType._GlobalAgentNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
