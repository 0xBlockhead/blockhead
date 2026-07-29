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
	}: EntityListViewProps<EntityType.BlockheadIntentQuote> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadIntentQuote}
	bind:open
	resource={
		selection({
			fields: {
				providerProtocol: true,
				source: true,
				requestedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadIntentQuote })}
		<EntityView
			entityType={EntityType.BlockheadIntentQuote}
			entitySelector={blockheadIntentQuote[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadIntentQuote.providerProtocol || 'blockhead intent quote'}
			{/snippet}

			{#snippet Value()}
				{blockheadIntentQuote.source}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadIntentQuote.requestedAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
