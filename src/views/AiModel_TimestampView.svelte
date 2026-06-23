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
				label: 'model',
			},
			{
				label: 'observation time',
			},
			{
				label: 'availability',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'model',
					},
					{
						label: 'timestamp',
					},
					'source',
					{
						label: 'availability',
					},
					{
						label: 'lifecycle',
					},
					{
						label: 'deprecated/deleted',
					},
				],
				[
					{
						label: 'provider display/description/version',
					},
					{
						label: 'context/max token limits',
					},
					{
						label: 'modalities',
					},
					{
						label: 'actions/endpoints',
					},
					{
						label: 'tool/structured/thinking/streaming support',
					},
					{
						label: 'pricing',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Model',
					items: [
						{
							label: 'AiModel',
						},
					],
				},
				{
					label: 'Capabilities',
					items: [
						{
							label: 'modalities/actions/endpoints/customization/inference/tool/JSON/thinking/streaming fields',
						},
					],
				},
				{
					label: 'Lifecycle',
					items: [
						{
							label: 'provider lifecycle',
						},
						{
							label: 'release/deprecation dates',
						},
						{
							label: 'deleted/deprecated flags',
						},
					],
				},
				{
					label: 'Defaults',
					items: [
						{
							label: 'tokenizer URL',
						},
						{
							label: 'sampling defaults',
						},
					],
				},
				{
					label: 'Pricing',
					items: [
						{
							label: 'token/cache pricing fields',
						},
					],
				},
				{
					label: 'Raw',
					items: [
						{
							label: 'raw provider payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiModel_Timestamp>
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
	entityType={EntityType.AiModel_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
