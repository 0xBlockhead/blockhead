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
				label: 'catalog id',
			},
			{
				label: 'catalog kind',
			},
			{
				label: 'latest model/provider coverage',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'catalog id',
					},
					'label',
					{
						label: 'catalog kind',
					},
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
