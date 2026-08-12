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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CashuMint> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CashuMint}
	bind:open
	resource={
		selection({
			...{
				fields: {
					mintUrl: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cashuMint })}
		{@const cashuMintSelector = cashuMint[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CashuMint}
			entitySelector={cashuMintSelector}
			href={
				resolve(
					'/cashu/mint/[mintUrl=absoluteUrl]',
					{
						mintUrl: encodeURIComponent(cashuMintSelector.mintUrl),
					}
				)
			}
		>
			{#snippet Title()}
				{cashuMintSelector.mintUrl || 'Cashu mint'}
			{/snippet}

			{#snippet Value()}
				{cashuMintSelector.mintUrl}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
