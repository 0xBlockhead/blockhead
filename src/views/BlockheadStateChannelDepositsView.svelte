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
	}: EntityListViewProps<EntityType.BlockheadStateChannelDeposit> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannelDeposit}
	bind:open
	resource={
		selection({
			fields: {
				$account: true,
				$network: true,
				$channel: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadStateChannelDeposit })}
		{@const blockheadStateChannelDepositSelector = blockheadStateChannelDeposit[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadStateChannelDeposit}
			entitySelector={blockheadStateChannelDepositSelector}
			href={
				resolve(
					'/~/channel/[channelId=stringSegment]/(blockheadStateChannel)/deposit/[accountAddress=evmAddress]',
					{
						channelId: blockheadStateChannelDepositSelector.$channel.id,
						accountAddress: blockheadStateChannelDepositSelector.$account.address,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadStateChannelDepositSelector.$account.address || 'EVM account'}
			{/snippet}

			{#snippet Value()}
				{blockheadStateChannelDeposit.$network.name || (blockheadStateChannelDeposit.$network.caip2 == null ? '' : `${blockheadStateChannelDeposit.$network.caip2.namespace}:${blockheadStateChannelDeposit.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadStateChannelDepositSelector.$channel.id || 'blockhead state channel'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
