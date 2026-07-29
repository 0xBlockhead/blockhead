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
	}: EntityListViewProps<EntityType.IbcPacket> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IbcPacket}
	bind:open
	resource={
		selection({
			fields: {
				sequence: true,
				direction: true,
				status: true,
			},
		})
	}
>
	{#snippet Item({ item: ibcPacket })}
		{@const ibcPacketSelector = ibcPacket[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IbcPacket}
			entitySelector={ibcPacketSelector}
		>
			{#snippet Title()}
				{`Packet #${ibcPacketSelector.sequence}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[ibcPacketSelector.direction, (ibcPacket.status ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
