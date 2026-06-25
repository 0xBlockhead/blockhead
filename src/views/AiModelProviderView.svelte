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
			label: 'provider id/domain',
		},
		'label',
	],
	content: {
		dl: [
			[
				'providerId',
				'domain',
				'label',
				'organizationKind',
			],
			[
				{
					label: 'homepage',
				},
				{
					label: 'docs',
				},
				{
					label: 'catalog/model/operation refs',
				},
			],
		],
	},
	details: {
		tabs: [
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
				label: 'API operations',
				items: [
					{
						label: 'AiProviderApiOperation list',
					},
				],
			},
		],
	},
	lists: [
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
			id: 'api-operations',
			label: 'api operations',
			field: '$$apiOperations',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AiModelProvider>
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
	entityType={EntityType.AiModelProvider}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
