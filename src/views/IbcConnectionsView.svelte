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
	}: EntityListViewProps<EntityType.IbcConnection> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IbcConnection}
	bind:open
	resource={
		selection({
			fields: {
				connectionId: true,
				state: true,
				clientId: true,
			},
		})
	}
>
	{#snippet Item({ item: ibcConnection })}
		{@const ibcConnectionSelector = ibcConnection[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IbcConnection}
			entitySelector={ibcConnectionSelector}
		>
			{#snippet Title()}
				{ibcConnectionSelector.connectionId || 'IBC connection'}
			{/snippet}

			{#snippet Value()}
				{[(ibcConnection.state ?? ''), ibcConnectionSelector.connectionId].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(ibcConnection.clientId ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
