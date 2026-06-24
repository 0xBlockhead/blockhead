<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	display: [
		{
			field: 'content',
			kind: 'markdown',
			slot: 'NostrArticleMarkdown',
		},
	],
	panels: [
		{
			id: 'article',
			label: 'Article',
			kind: 'media',
			defer: 'open',
			slot: 'NostrArticleContent',
		},
	],
	closed: [
		{
			label: 'coordinate kind/pubkey/identifier',
		},
		'title',
		{
			label: 'author',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'coordinate kind/pubkey/identifier',
				},
				'title',
				{
					label: 'author',
				},
				'publishedAt',
				{
					label: 'image URL',
				},
				{
					label: 'tag count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Content',
				items: [
					{
						label: 'rendered content/summary',
					},
				],
			},
			{
				label: 'Author',
				items: [
					{
						label: 'author Nostr profile',
					},
				],
			},
			{
				label: 'Raw event',
				items: [
					{
						label: 'kind/pubkey/tags/signature/source relays',
					},
				],
			},
			{
				label: 'Relay evidence',
				items: [
					{
						label: 'relay URLs or indexer payloads that returned the current addressable event',
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
			selection: EntityProxyResource<typeof schema, EntityType.NostrArticle>
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
	entityType={EntityType.NostrArticle}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
