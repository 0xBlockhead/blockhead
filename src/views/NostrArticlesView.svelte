<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A Nostr long-form article is a replaceable kind-30023 event addressed by author public key and identifier.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NostrArticle> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrArticle}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				identifier: true,
				pubkey: true,
				kind: true,
			},
		})
	}
>
	{#snippet Item({ item: nostrArticle })}
		{@const nostrArticleSelector = nostrArticle[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NostrArticle}
			entitySelector={nostrArticleSelector}
			href={
				nostrArticleSelector.kind === 30023 ?
					resolve(
						'/(social)/(nostr)/nostr/(globalNostrNetwork)/article/[pubkey=stringSegment]/[identifier=stringSegment]',
						{
							pubkey: nostrArticleSelector.pubkey,
							identifier: nostrArticleSelector.identifier,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{[nostrArticleSelector.identifier, nostrArticleSelector.pubkey].filter(Boolean).join(' ') || 'Nostr article'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{'kind ' + nostrArticleSelector.kind}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
