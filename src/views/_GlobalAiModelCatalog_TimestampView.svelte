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
				label: 'catalog',
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
						label: 'catalog',
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
						label: 'source-reported/local provider/model/dataset/benchmark/eval counts',
					},
					{
						label: 'search result count',
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
					label: 'Catalog',
					items: [
						{
							label: '_GlobalAiModelCatalog',
						},
					],
				},
				{
					label: 'Counts',
					items: [
						{
							label: 'scoped provider/model/dataset/benchmark/eval counts',
						},
					],
				},
				{
					label: 'Source health',
					items: [
						{
							label: 'endpoint reachability',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAiModelCatalog_Timestamp>
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
	entityType={EntityType._GlobalAiModelCatalog_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
