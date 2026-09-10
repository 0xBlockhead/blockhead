<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Token metadata',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.TokenMetadataDocument> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TokenMetadataDocument}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$media: true,
				name: true,
				symbol: true,
				metadataKey: true,
				metadataStandard: true,
				source: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: tokenMetadataDocument })}
		{@const tokenMetadataDocumentSelector = tokenMetadataDocument[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TokenMetadataDocument}
			entitySelector={tokenMetadataDocumentSelector}
			href={
				resolve(
					'/token-metadata/[metadataSubjectKey=stringSegment]/[metadataKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						metadataSubjectKey: tokenMetadataDocumentSelector.metadataSubjectKey,
						metadataKey: tokenMetadataDocumentSelector.metadataKey,
						timestampMs: String(tokenMetadataDocumentSelector.timestampMs),
						source: tokenMetadataDocumentSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(tokenMetadataDocument.name ?? ''), (tokenMetadataDocument.symbol ?? ''), tokenMetadataDocumentSelector.metadataKey].filter(Boolean).join(' ') || 'token metadata document'}
			{/snippet}

			{#snippet Value()}
				{[(tokenMetadataDocument.metadataStandard ?? ''), tokenMetadataDocumentSelector.source].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tokenMetadataDocumentSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
