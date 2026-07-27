<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		title = 'Feeds',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.LensFeed> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensFeed}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				address: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: lensFeed })}
		{@const lensFeedSelector = lensFeed[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LensFeed}
			entitySelector={lensFeedSelector}
		>
			{#snippet Title()}
				{[(lensFeed.name ?? ''), String(lensFeedSelector.address)].filter(Boolean).join(' ') || 'Lens feed'}
			{/snippet}

			{#snippet Value()}
				{String(lensFeedSelector.address)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(lensFeed.createdAt ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
