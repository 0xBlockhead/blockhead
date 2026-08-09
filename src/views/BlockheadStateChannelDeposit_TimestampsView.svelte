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
	}: EntityListViewProps<EntityType.BlockheadStateChannelDeposit_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannelDeposit_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					source: true,
					availableBalance: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadStateChannelDepositTimestamp })}
		{@const blockheadStateChannelDepositTimestampSelector = blockheadStateChannelDepositTimestamp[EntityMetaKey.Selector]}
		{@const deposit = blockheadStateChannelDepositTimestampSelector.$deposit}
		<EntityView
			entityType={EntityType.BlockheadStateChannelDeposit_Timestamp}
			entitySelector={blockheadStateChannelDepositTimestampSelector}
			href={
				resolve(
					'/~/channel/[channelId=stringSegment]/(blockheadStateChannel)/deposit/[accountAddress=evmAddress]/(blockheadStateChannelDeposit)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						channelId: deposit.$channel.id,
						accountAddress: deposit.$account.address,
						timestampMs: String(blockheadStateChannelDepositTimestampSelector.timestampMs),
						source: blockheadStateChannelDepositTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadStateChannelDepositTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadStateChannelDepositTimestampSelector.source}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadStateChannelDepositTimestamp.availableBalance}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
