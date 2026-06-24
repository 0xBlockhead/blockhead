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
			label: 'entry',
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
					label: 'entry',
				},
				{
					label: 'timestamp',
				},
				'source',
				{
					label: 'availability',
				},
			],
			[
				{
					label: 'raw provider payload',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Entry',
				items: [
					{
						label: 'AiProviderCatalogEntry',
					},
				],
			},
			{
				label: 'Raw',
				items: [
					{
						label: 'raw source payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiProviderCatalogEntry_Timestamp>
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
	entityType={EntityType.AiProviderCatalogEntry_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
