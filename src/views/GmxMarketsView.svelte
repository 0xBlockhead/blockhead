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
	}: EntityListViewProps<EntityType.GmxMarket> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GmxMarket}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				longInterestUsd: true,
				shortInterestUsd: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: gmxMarket })}
		<EntityView
			entityType={EntityType.GmxMarket}
			entitySelector={gmxMarket[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{gmxMarket.name || 'GMX market'}
			{/snippet}

			{#snippet Value()}
				{[(gmxMarket.longInterestUsd ?? ''), (gmxMarket.shortInterestUsd ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{gmxMarket.$network.name || (gmxMarket.$network.caip2 == null ? '' : `${gmxMarket.$network.caip2.namespace}:${gmxMarket.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
