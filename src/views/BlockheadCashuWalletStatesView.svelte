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
	}: EntityListViewProps<EntityType.BlockheadCashuWalletState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuWalletState}
	bind:open
	resource={
		selection({
			fields: {
				walletId: true,
				unit: true,
				$mint: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCashuWalletState })}
		{@const blockheadCashuWalletStateSelector = blockheadCashuWalletState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadCashuWalletState}
			entitySelector={blockheadCashuWalletStateSelector}
		>
			{#snippet Title()}
				{blockheadCashuWalletStateSelector.walletId || 'blockhead Cashu wallet state'}
			{/snippet}

			{#snippet Value()}
				{[blockheadCashuWalletStateSelector.unit, blockheadCashuWalletState.$mint.mintUrl || 'Cashu mint'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
