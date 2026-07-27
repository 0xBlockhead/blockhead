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
	}: EntityListViewProps<EntityType.LogosBlockchainNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LogosBlockchainNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				height: true,
				mode: true,
			},
		})
	}
>
	{#snippet Item({ item: logosBlockchainNetworkTimestamp })}
		{@const logosBlockchainNetworkTimestampSelector = logosBlockchainNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LogosBlockchainNetwork_Timestamp}
			entitySelector={logosBlockchainNetworkTimestampSelector}
		>
			{#snippet Title()}
				{String(logosBlockchainNetworkTimestampSelector.timestampMs) || 'Logos blockchain network timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(logosBlockchainNetworkTimestamp.height ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(logosBlockchainNetworkTimestamp.mode ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
