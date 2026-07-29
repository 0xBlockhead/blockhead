<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Referendum observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotReferendum_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotReferendum_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				status: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotReferendumTimestamp })}
		{@const polkadotReferendumTimestampSelector = polkadotReferendumTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PolkadotReferendum_Timestamp}
			entitySelector={polkadotReferendumTimestampSelector}
		>
			{#snippet Title()}
				{(polkadotReferendumTimestamp.status ?? '') || 'Polkadot referendum timestamp'}
			{/snippet}

			{#snippet Value()}
				{polkadotReferendumTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotReferendumTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
