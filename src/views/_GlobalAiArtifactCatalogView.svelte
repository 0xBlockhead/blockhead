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
			label: 'latest artifact/document coverage',
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
					label: 'artifact refs',
				},
				{
					label: 'document refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Artifacts',
				items: [
					{
						label: 'AiArtifact list',
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
				label: 'Claims',
				items: [
					{
						label: 'AiDocumentClaim and AiRelationshipClaim lists',
					},
				],
			},
			{
				label: 'Observations',
				items: [
					{
						label: '_GlobalAiArtifactCatalog_Timestamp list',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'artifacts',
			label: 'artifacts',
			field: '$$artifacts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'documents',
			label: 'documents',
			field: '$$documents',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAiArtifactCatalog>
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
	entityType={EntityType._GlobalAiArtifactCatalog}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
