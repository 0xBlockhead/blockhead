<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		<EntityView
			entityType={EntityType.AiDocument}
			entitySelector={aiDocument[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{aiDocument.documentKind || 'AI document'}
			{/snippet}

			{#snippet Value()}
				{aiDocument.mediaType ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiDocument.documentUrl ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
