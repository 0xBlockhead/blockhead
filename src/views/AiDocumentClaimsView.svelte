<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.AiDocumentClaim> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiDocumentClaim}
	bind:open
	resource={
		selection({
			fields: {
				claimPath: true,
				claimKind: true,
				confidence: true,
			},
		})
	}
>
	{#snippet Item({ item: aiDocumentClaim })}
		{@const aiDocumentClaimSelector = aiDocumentClaim[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiDocumentClaim}
			entitySelector={aiDocumentClaimSelector}
		>
			{#snippet Title()}
				{aiDocumentClaimSelector.claimPath || 'AI document claim'}
			{/snippet}

			{#snippet Value()}
				{aiDocumentClaim.claimKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiDocumentClaim.confidence ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
