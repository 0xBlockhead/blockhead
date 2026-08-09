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
		title = 'Blockhead Monero subaddress states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadMoneroSubaddressState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroSubaddressState}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					address: true,
					accountIndex: true,
					addressIndex: true,
					walletId: true,
					label: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadMoneroSubaddressState })}
		{@const blockheadMoneroSubaddressStateSelector = blockheadMoneroSubaddressState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadMoneroSubaddressState}
			entitySelector={blockheadMoneroSubaddressStateSelector}
			href={
				resolve(
					'/~/monero/wallet/[walletId=stringSegment]/subaddress-state/[accountIndex=nonNegativeInteger]/[addressIndex=nonNegativeInteger]',
					{
						walletId: blockheadMoneroSubaddressStateSelector.walletId,
						accountIndex: String(blockheadMoneroSubaddressStateSelector.accountIndex),
						addressIndex: String(blockheadMoneroSubaddressStateSelector.addressIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadMoneroSubaddressState.address ?? '') || blockheadMoneroSubaddressStateSelector.walletId || 'blockhead monero subaddress state'}
			{/snippet}

			{#snippet Value()}
				{[String(blockheadMoneroSubaddressStateSelector.accountIndex), String(blockheadMoneroSubaddressStateSelector.addressIndex)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadMoneroSubaddressState.label ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
