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
				label: 'provider',
			},
			{
				label: 'provider model id',
			},
			'label',
		],
		content: {
			dl: [
				[
					{
						label: 'provider',
					},
					{
						label: 'provider model id',
					},
					{
						label: 'provider resource name',
					},
					{
						label: 'base model id',
					},
					'label',
					{
						label: 'model family',
					},
				],
				[
					{
						label: 'provider owned-by/created-at',
					},
					{
						label: 'latest availability/capabilities',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Versions',
					items: [
						{
							label: 'AiModelVersion list',
						},
					],
				},
				{
					label: 'Observations',
					items: [
						{
							label: 'AiModel_Timestamp list',
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
				{
					label: 'Catalog entries',
					items: [
						{
							label: 'AiProviderCatalogEntry list',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiModel>
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
	entityType={EntityType.AiModel}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
