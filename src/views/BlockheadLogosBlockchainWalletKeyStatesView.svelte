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
	}: EntityListViewProps<EntityType.BlockheadLogosBlockchainWalletKeyState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
	bind:open
	resource={
		selection({
			fields: {
				publicKey: true,
				$nodeState: {
					fields: {
						endpoint: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadLogosBlockchainWalletKeyState })}
		{@const blockheadLogosBlockchainWalletKeyStateSelector = blockheadLogosBlockchainWalletKeyState[EntityMetaKey.Selector]}
		{@const nodeState = blockheadLogosBlockchainWalletKeyStateSelector.$nodeState}
		<EntityView
			entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
			entitySelector={blockheadLogosBlockchainWalletKeyStateSelector}
			href={
				resolve(
					'/~/logos/connection/[connectionId=stringSegment]/node-state/[peerId=stringSegment]/(blockheadLogosBlockchainNodeState)/wallet-key/[publicKey=zeroExHex]',
					{
						connectionId: nodeState.connectionId,
						peerId: nodeState.peerId,
						publicKey: blockheadLogosBlockchainWalletKeyStateSelector.publicKey,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLogosBlockchainWalletKeyStateSelector.publicKey || 'blockhead Logos blockchain wallet key state'}
			{/snippet}

			{#snippet Value()}
				{blockheadLogosBlockchainWalletKeyStateSelector.$nodeState.peerId || 'blockhead Logos blockchain node state'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
