<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Litecoin MWEB wallet states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadLitecoinMwebWalletState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLitecoinMwebWalletState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				walletId: true,
				$network: true,
				$wallet: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLitecoinMwebWalletState })}
		{@const blockheadLitecoinMwebWalletStateSelector = blockheadLitecoinMwebWalletState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLitecoinMwebWalletState}
			entitySelector={blockheadLitecoinMwebWalletStateSelector}
		>
			{#snippet Title()}
				{blockheadLitecoinMwebWalletStateSelector.walletId || 'blockhead litecoin mweb wallet state'}
			{/snippet}

			{#snippet Value()}
				{blockheadLitecoinMwebWalletState.$network.name || (blockheadLitecoinMwebWalletStateSelector.$network.caip2 == null ? '' : `${blockheadLitecoinMwebWalletStateSelector.$network.caip2.namespace}:${blockheadLitecoinMwebWalletStateSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLitecoinMwebWalletState.$wallet == null ? '' : blockheadLitecoinMwebWalletState.$wallet.name || 'blockhead wallet'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
