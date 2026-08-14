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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadLightningPeer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningPeer}
	bind:open
	resource={
		selection({
			...{
				fields: {
					publicKey: true,
					$localNodeState: true,
					$node: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningPeer })}
		{@const blockheadLightningPeerSelector = blockheadLightningPeer[EntityMetaKey.Selector]}
		{@const localNodeState = blockheadLightningPeerSelector.$localNodeState}
		<EntityView
			entityType={EntityType.BlockheadLightningPeer}
			entitySelector={blockheadLightningPeerSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/peer/[publicKey=stringSegment]',
					{
						network: (
							'caip2' in localNodeState.$network.$network ?
								caip2StringFromValue(localNodeState.$network.$network.caip2)
							:
								localNodeState.$network.$network.slug
						),
						connectionId: localNodeState.connectionId,
						publicKey: blockheadLightningPeerSelector.publicKey,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLightningPeerSelector.publicKey || 'local LND peer'}
			{/snippet}

			{#snippet Value()}
				{(blockheadLightningPeer.$localNodeState.alias ?? '') || blockheadLightningPeerSelector.$localNodeState.connectionId || 'local LND node state'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLightningPeer.$node == null ? '' : blockheadLightningPeer.$node.publicKey || 'Lightning public node'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
