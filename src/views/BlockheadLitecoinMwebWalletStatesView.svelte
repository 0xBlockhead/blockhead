<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			...{
				fields: {
					walletId: true,
					$network: true,
					$wallet: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadLitecoinMwebWalletState })}
		{@const blockheadLitecoinMwebWalletStateSelector = blockheadLitecoinMwebWalletState[EntityMetaKey.Selector]}
		{@const network = blockheadLitecoinMwebWalletStateSelector.$network}
		<EntityView
			entityType={EntityType.BlockheadLitecoinMwebWalletState}
			entitySelector={blockheadLitecoinMwebWalletStateSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/litecoin-mweb/wallet/[walletId=stringSegment]/state',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						walletId: blockheadLitecoinMwebWalletStateSelector.walletId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLitecoinMwebWalletStateSelector.walletId || 'blockhead litecoin mweb wallet state'}
			{/snippet}

			{#snippet Value()}
				{blockheadLitecoinMwebWalletState.$network.name || (blockheadLitecoinMwebWalletState.$network.caip2 == null ? '' : `${blockheadLitecoinMwebWalletState.$network.caip2.namespace}:${blockheadLitecoinMwebWalletState.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLitecoinMwebWalletState.$wallet == null ? '' : blockheadLitecoinMwebWalletState.$wallet.name || 'blockhead wallet'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
