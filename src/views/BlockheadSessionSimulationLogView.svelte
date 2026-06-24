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
			label: 'simulation',
		},
		{
			label: 'log index',
		},
		'address',
	],
	content: {
		dl: [
			[
				{
					label: 'simulation',
				},
				{
					label: 'log index',
				},
				{
					label: 'call path',
				},
				'address',
				{
					label: 'topic0',
				},
				{
					label: 'topic count',
				},
				{
					label: 'data hash',
				},
				{
					label: 'removed flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Simulation',
				items: [
					{
						label: 'BlockheadSessionSimulationView',
					},
				],
			},
			{
				label: 'Call',
				items: [
					{
						label: 'simulation call row when callPath maps',
					},
				],
			},
			{
				label: 'Topics',
				items: [
					{
						label: 'topic list and decoded event when implemented',
					},
				],
			},
			{
				label: 'Raw data',
				items: [
					{
						label: 'data hash and retained runtime payload when needed',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSessionSimulationLog>
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
	entityType={EntityType.BlockheadSessionSimulationLog}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
