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
	}: EntityListViewProps<EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					balance: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadLogosBlockchainWalletKeyStateTimestamp })}
		{@const blockheadLogosBlockchainWalletKeyStateTimestampSelector = blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.Selector]}
		{@const walletKeyState = blockheadLogosBlockchainWalletKeyStateTimestampSelector.$walletKeyState}
		<EntityView
			entityType={EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp}
			entitySelector={blockheadLogosBlockchainWalletKeyStateTimestampSelector}
			href={
				resolve(
					'/~/logos/connection/[connectionId=stringSegment]/node-state/[peerId=stringSegment]/(blockheadLogosBlockchainNodeState)/wallet-key/[publicKey=zeroExHex]/(blockheadLogosBlockchainWalletKeyState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						connectionId: walletKeyState.$nodeState.connectionId,
						peerId: walletKeyState.$nodeState.peerId,
						publicKey: walletKeyState.publicKey,
						timestampMs: String(blockheadLogosBlockchainWalletKeyStateTimestampSelector.timestampMs),
						source: blockheadLogosBlockchainWalletKeyStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLogosBlockchainWalletKeyStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadLogosBlockchainWalletKeyStateTimestamp.balance ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLogosBlockchainWalletKeyStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
