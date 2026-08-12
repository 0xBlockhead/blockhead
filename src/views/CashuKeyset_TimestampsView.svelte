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
	}: EntityListViewProps<EntityType.CashuKeyset_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CashuKeyset_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					active: true,
					inputFeePpk: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cashuKeysetTimestamp })}
		{@const cashuKeysetTimestampSelector = cashuKeysetTimestamp[EntityMetaKey.Selector]}
		{@const keyset = cashuKeysetTimestampSelector.$keyset}
		<EntityView
			entityType={EntityType.CashuKeyset_Timestamp}
			entitySelector={cashuKeysetTimestampSelector}
			href={
				resolve(
					'/cashu/mint/[mintUrl=absoluteUrl]/(cashuMint)/keyset/[keysetId=stringSegment]/(cashuKeyset)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						mintUrl: encodeURIComponent(keyset.$mint.mintUrl),
						keysetId: keyset.keysetId,
						timestampMs: String(cashuKeysetTimestampSelector.timestampMs),
						source: cashuKeysetTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{cashuKeysetTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(cashuKeysetTimestamp.active ?? ''), String(cashuKeysetTimestamp.inputFeePpk ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
