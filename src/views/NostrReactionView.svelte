<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	lists: [
		{
			id: 'reactions',
			label: 'Reactions',
			limit: 50,
			query: {
				limit: 50,
				fields: [
					'createdAt',
				],
			},
			item: 'link',
			itemHref: {
				label: '/nostr/reaction/[eventId]',
			},
			key: 'eventId',
			emptyText: 'No reactions yet.',
		},
	],
	closed: [
		'eventId',
		'kind',
		'$author',
	],
	content: {
		dl: [
			[
				'eventId',
				'kind',
				'$author',
				'createdAt',
				{
					label: 'reaction content',
				},
				'$targetNote',
				'$targetArticle',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Target',
				items: [
					{
						label: 'target note or article',
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
						label: 'pubkey/tags/signature/source relays',
					},
				],
			},
			{
				label: 'Relay evidence',
				items: [
					{
						label: 'filters',
					},
					{
						label: 'relays/indexers that returned the reaction',
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
			selection: EntityProxyResource<typeof schema, EntityType.NostrReaction>
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
	entityType={EntityType.NostrReaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
