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
			label: 'document kind',
		},
		{
			label: 'hash/artifact/url',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'document kind',
				},
				{
					label: 'content hash algorithm/hash',
				},
				{
					label: 'artifact',
				},
				{
					label: 'document URL',
				},
			],
			[
				{
					label: 'media type',
				},
				{
					label: 'source format',
				},
				{
					label: 'schema version',
				},
				'conformsTo',
				{
					label: 'declared subject',
				},
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
