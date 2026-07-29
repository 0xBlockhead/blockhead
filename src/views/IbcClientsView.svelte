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
	}: EntityListViewProps<EntityType.IbcClient> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IbcClient}
	bind:open
	resource={
		selection({
			fields: {
				clientId: true,
				clientType: true,
				counterpartyChainId: true,
			},
		})
	}
>
	{#snippet Item({ item: ibcClient })}
		{@const ibcClientSelector = ibcClient[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IbcClient}
			entitySelector={ibcClientSelector}
		>
			{#snippet Title()}
				{ibcClientSelector.clientId || 'IBC client'}
			{/snippet}

			{#snippet Value()}
				{[(ibcClient.clientType ?? ''), ibcClientSelector.clientId].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{ibcClient.counterpartyChainId ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
