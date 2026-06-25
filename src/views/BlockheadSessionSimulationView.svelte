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
		'$session',
		'status',
		'createdAt',
	],
	content: {
		dl: [
			[
				'$session',
				'status',
				'createdAt',
				{
					label: 'completed time',
				},
				'paramsHash',
			],
			[
				{
					label: 'fork block',
				},
				'actionCount',
				'gasUsed',
				'resultPayloadHash',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Session',
				items: [
					{
						label: 'parent local session',
					},
				],
			},
			{
				label: 'Inputs',
				items: [
					'paramsHash',
					{
						label: 'source action context',
					},
					{
						label: 'fork metadata',
					},
				],
			},
			{
				label: 'Calls',
				items: [
					{
						label: 'BlockheadSessionSimulationCall tree/list',
					},
				],
			},
			{
				label: 'Logs',
				items: [
					{
						label: 'BlockheadSessionSimulationLog list',
					},
				],
			},
			{
				label: 'Result summary',
				items: [
					{
						label: 'compact local simulation output summary',
					},
				],
			},
			{
				label: 'Raw runtime',
				items: [
					{
						label: 'local simulation output retained out of band when needed',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'calls',
			label: 'calls',
			field: '$$calls',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'logs',
			label: 'logs',
			field: '$$logs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
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
