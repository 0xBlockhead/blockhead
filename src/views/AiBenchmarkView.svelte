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
			label: 'benchmark id/URI',
		},
		'label',
		'taskType',
	],
	content: {
		dl: [
			[
				'benchmarkId',
				'benchmarkUri',
				'sourceBenchmarkId',
				'label',
			],
			[
				'taskType',
				{
					label: 'metric name/type',
				},
				'$dataset',
				'license',
				{
					label: 'document refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Dataset',
				items: [
					{
						label: 'AiDataset',
					},
				],
			},
			{
				label: 'Evaluations',
				items: [
					{
						label: 'AiEvaluation_Timestamp list',
					},
				],
			},
			{
				label: 'Documents',
				items: [
					{
						label: 'AiDocument list',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'documents',
			label: 'documents',
			field: '$$documents',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiBenchmark>
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
	entityType={EntityType.AiBenchmark}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
