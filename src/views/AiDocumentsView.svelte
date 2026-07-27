<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AiDocument> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiDocument}
	bind:open
	resource={
		selection({
			fields: {
				documentKind: true,
				mediaType: true,
				documentUrl: true,
			},
		})
	}
>
	{#snippet Item({ item: aiDocument })}
		{@const aiDocumentSelector = aiDocument[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiDocument}
			entitySelector={aiDocumentSelector}
		>
			{#snippet Title()}
				{aiDocumentSelector.documentKind || 'AI document'}
			{/snippet}

			{#snippet Value()}
				{(aiDocument.mediaType ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(aiDocumentSelector.documentUrl ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
