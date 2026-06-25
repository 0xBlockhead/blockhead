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
		'subjectKind',
		'$benchmark',
		{
			label: 'metric/value',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'subject kind/selector',
				},
				'$benchmark',
				'metricType',
				'value',
				'unit',
			],
			[
				'timestampMs',
				'source',
				{
					label: 'run/result/step',
				},
				'datasetType',
				'split',
				'method',
				'harnessVersion',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Subject',
				items: [
					{
						label: 'concrete model/modelVersion/A2A/MCP/EIP-8004 ref',
					},
				],
			},
			{
				label: 'Benchmark',
				items: [
					{
						label: 'AiBenchmark',
					},
				],
			},
			{
				label: 'Dataset',
				items: [
					{
						label: 'dataset name/type/config/split/digest',
					},
				],
			},
			{
				label: 'Source run',
				items: [
					{
						label: 'source run/result/source URL',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'raw eval payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiEvaluation_Timestamp>
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
	entityType={EntityType.AiEvaluation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
