<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.FedimintFederation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FedimintFederation_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				health: true,
				reachable: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: fedimintFederationTimestamp })}
		{@const fedimintFederationTimestampSelector = fedimintFederationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FedimintFederation_Timestamp}
			entitySelector={fedimintFederationTimestampSelector}
		>
			{#snippet Title()}
				{fedimintFederationTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(fedimintFederationTimestamp.health ?? ''), String(fedimintFederationTimestamp.reachable ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{fedimintFederationTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
