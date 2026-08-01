<!-- Generated from APP.ts. Do not edit by hand. -->

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
		id = 'FarcasterVerifiedAddresses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FarcasterVerifiedAddress> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterVerifiedAddress}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				address: true,
				protocol: true,
				fid: true,
			},
		})
	}
>
	{#snippet Item({ item: farcasterVerifiedAddress })}
		{@const farcasterVerifiedAddressSelector = farcasterVerifiedAddress[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FarcasterVerifiedAddress}
			entitySelector={farcasterVerifiedAddressSelector}
			href={
				resolve(
					'/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/verified-address/[protocol=stringSegment]/[address=stringSegment]',
					{
						userId: String(farcasterVerifiedAddressSelector.fid),
						protocol: farcasterVerifiedAddressSelector.protocol,
						address: farcasterVerifiedAddressSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{farcasterVerifiedAddressSelector.address || 'Farcaster verified address'}
			{/snippet}

			{#snippet Value()}
				{[farcasterVerifiedAddressSelector.protocol, ' / FID ', String(farcasterVerifiedAddressSelector.fid)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
