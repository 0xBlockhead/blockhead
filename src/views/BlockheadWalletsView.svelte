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
	}: EntityListViewProps<EntityType.BlockheadWallet> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWallet}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					protocol: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadWallet })}
		{@const blockheadWalletSelector = blockheadWallet[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWallet}
			entitySelector={blockheadWalletSelector}
			href={
				resolve(
					'/~/wallet/[id=stringSegment]',
					{
						id: blockheadWalletSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadWallet.name || 'blockhead wallet'}
			{/snippet}

			{#snippet Value()}
				{blockheadWallet.protocol}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
