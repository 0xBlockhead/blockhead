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
	}: EntityListViewProps<EntityType.ZeroGDaQuorum> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGDaQuorum}
	bind:open
	resource={
		selection({
			...{
				fields: {
					quorumId: true,
					$network: true,
					$consensusNetwork: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: zeroGDaQuorum })}
		{@const zeroGDaQuorumSelector = zeroGDaQuorum[EntityMetaKey.Selector]}
		{@const network = zeroGDaQuorumSelector.$network}
		<EntityView
			entityType={EntityType.ZeroGDaQuorum}
			entitySelector={zeroGDaQuorumSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/da-quorum/[quorumId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						quorumId: zeroGDaQuorumSelector.quorumId,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGDaQuorumSelector.quorumId || 'zero g da quorum'}
			{/snippet}

			{#snippet Value()}
				{zeroGDaQuorum.$network.name || (zeroGDaQuorum.$network.caip2 == null ? '' : `${zeroGDaQuorum.$network.caip2.namespace}:${zeroGDaQuorum.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGDaQuorum.$consensusNetwork == null ? '' : zeroGDaQuorum.$consensusNetwork.consensusNetworkId || 'zero g consensus network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
