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
		'documentKind',
		{
			label: 'hash/artifact/url',
		},
	],
	content: {
		dl: [
			[
				'documentKind',
				{
					label: 'content hash algorithm/hash',
				},
				'$artifact',
				'documentUrl',
			],
			[
				'mediaType',
				'sourceFormat',
				'schemaVersion',
				'conformsTo',
				'declaredSubjectKind',
				{
					label: 'claim refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Claims',
				items: [
					{
						label: 'AiDocumentClaim list',
					},
				],
			},
			{
				label: 'Artifact',
				items: [
					{
						label: 'AiArtifact when present',
					},
				],
			},
			{
				label: 'Relationship claims',
				items: [
					{
						label: 'AiRelationshipClaim list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw document source',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'claims',
			label: 'claims',
			field: '$$claims',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiDocument>
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
	entityType={EntityType.AiDocument}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
