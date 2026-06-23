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
				label: 'catalog kind',
			},
			{
				label: 'entry id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'provider',
					},
					{
						label: 'catalog kind',
					},
					{
						label: 'provider entry id',
					},
					{
						label: 'label',
					},
				],
				[
					{
						label: 'subject kind/selector',
					},
					{
						label: 'latest availability',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Provider',
					items: [
						{
							label: 'AiModelProvider',
						},
					],
				},
				{
					label: 'Observations',
					items: [
						{
							label: 'AiProviderCatalogEntry_Timestamp list',
						},
					],
				},
				{
					label: 'Subject',
					items: [
						{
							label: 'subject selector/linked row when resolved',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiProviderCatalogEntry>
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
	entityType={EntityType.AiProviderCatalogEntry}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
