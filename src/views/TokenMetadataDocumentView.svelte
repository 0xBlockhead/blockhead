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
				label: 'metadata subject',
			},
			{
				label: 'metadata key',
			},
			{
				label: 'timestamp',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'metadata subject key',
					},
					{
						label: 'asset instance',
					},
					{
						label: 'object',
					},
					{
						label: 'metadata key',
					},
					{
						label: 'timestamp',
					},
					{
						label: 'URI',
					},
					{
						label: 'content hash',
					},
					{
						label: 'metadata standard',
					},
					{
						label: 'mutable flag',
					},
					'source',
					{
						label: 'media URL',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Fields',
					items: [
						{
							label: 'name/symbol/description/attributes',
						},
					],
				},
				{
					label: 'Media',
					items: [
						{
							label: 'embedded media URL/MIME/dimensions from this metadata source',
						},
					],
				},
				{
					label: 'Subject',
					items: [
						{
							label: 'asset-level or object-level subject encoded by metadataSubjectKey',
						},
					],
				},
				{
					label: 'Raw document',
					items: [
						{
							label: 'JSON/source payload',
						},
					],
				},
				{
					label: 'History',
					items: [
						{
							label: 'sibling metadata observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.TokenMetadataDocument>
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
	entityType={EntityType.TokenMetadataDocument}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
