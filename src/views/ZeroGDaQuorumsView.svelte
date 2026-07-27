<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			fields: {
				quorumId: true,
				$network: true,
				$consensusNetwork: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGDaQuorum })}
		{@const zeroGDaQuorumSelector = zeroGDaQuorum[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGDaQuorum}
			entitySelector={zeroGDaQuorumSelector}
		>
			{#snippet Title()}
				{zeroGDaQuorumSelector.quorumId || 'zero g da quorum'}
			{/snippet}

			{#snippet Value()}
				{zeroGDaQuorum.$network.name || (zeroGDaQuorumSelector.$network.caip2 == null ? '' : `${zeroGDaQuorumSelector.$network.caip2.namespace}:${zeroGDaQuorumSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGDaQuorum.$consensusNetwork == null ? '' : zeroGDaQuorum.$consensusNetwork.consensusNetworkId || 'zero g consensus network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
