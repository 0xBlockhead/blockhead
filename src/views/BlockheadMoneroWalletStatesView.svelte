<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Monero wallet states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadMoneroWalletState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroWalletState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				walletId: true,
				primaryAddress: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadMoneroWalletState })}
		{@const blockheadMoneroWalletStateSelector = blockheadMoneroWalletState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadMoneroWalletState}
			entitySelector={blockheadMoneroWalletStateSelector}
		>
			{#snippet Title()}
				{blockheadMoneroWalletStateSelector.walletId || 'blockhead monero wallet state'}
			{/snippet}

			{#snippet Value()}
				{blockheadMoneroWalletState.primaryAddress ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadMoneroWalletState.$network.$network.name || (blockheadMoneroWalletState.$network.$network.caip2 == null ? '' : `${blockheadMoneroWalletState.$network.$network.caip2.namespace}:${blockheadMoneroWalletState.$network.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
