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
	}: EntityListViewProps<EntityType.CompoundComet> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CompoundComet}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				baseTokenSymbol: true,
				collateralAssetCount: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: compoundComet })}
		<EntityView
			entityType={EntityType.CompoundComet}
			entitySelector={compoundComet[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{compoundComet.name || 'Compound Comet market'}
			{/snippet}

			{#snippet Value()}
				{[compoundComet.baseTokenSymbol, String(compoundComet.collateralAssetCount)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{compoundComet.$network.name || (compoundComet.$network.caip2 == null ? '' : `${compoundComet.$network.caip2.namespace}:${compoundComet.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
