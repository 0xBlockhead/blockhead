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
		'catalogId',
		'catalogKind',
		{
			label: 'latest model/provider coverage',
		},
	],
	content: {
		dl: [
			[
				'catalogId',
				'label',
				'catalogKind',
				{
					label: 'latest observation',
				},
			],
			[
				{
					label: 'provider/model/dataset/benchmark entry points',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Providers',
				items: [
					{
						label: 'AiModelProvider list',
					},
				],
			},
			{
				label: 'Catalog entries',
				items: [
					{
						label: 'AiProviderCatalogEntry list',
					},
				],
			},
			{
				label: 'Models',
				items: [
					{
						label: 'AiModel list',
					},
				],
			},
			{
				label: 'Datasets',
				items: [
					{
						label: 'AiDataset list',
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
				label: 'Observations',
				items: [
					{
						label: '_GlobalAiModelCatalog_Timestamp list',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'providers',
			label: 'providers',
			field: '$$providers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'catalog-entries',
			label: 'catalog entries',
			field: '$$catalogEntries',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'models',
			label: 'models',
			field: '$$models',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'datasets',
			label: 'datasets',
			field: '$$datasets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'benchmarks',
			label: 'benchmarks',
			field: '$$benchmarks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'evaluations',
			label: 'evaluations',
			field: '$$evaluations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAiModelCatalog>
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
	entityType={EntityType._GlobalAiModelCatalog}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
