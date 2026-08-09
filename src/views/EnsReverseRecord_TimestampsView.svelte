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
	}: EntityListViewProps<EntityType.EnsReverseRecord_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EnsReverseRecord_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					verified: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: ensReverseRecordTimestamp })}
		{@const ensReverseRecordTimestampSelector = ensReverseRecordTimestamp[EntityMetaKey.Selector]}
		{@const reverseRecord = ensReverseRecordTimestampSelector.$reverseRecord}
		<EntityView
			entityType={EntityType.EnsReverseRecord_Timestamp}
			entitySelector={ensReverseRecordTimestampSelector}
			href={
				resolve(
					'/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]/(account)/ens/reverse/[ensName=stringSegment]/(ensReverseRecord)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						namespace: reverseRecord.$account.caip10.namespace,
						reference: reverseRecord.$account.caip10.reference,
						accountAddress: reverseRecord.$account.caip10.accountAddress,
						ensName: encodeURIComponent(reverseRecord.$name.name),
						timestampMs: String(ensReverseRecordTimestampSelector.timestampMs),
						source: ensReverseRecordTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{ensReverseRecordTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{ensReverseRecordTimestamp.verified ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{ensReverseRecordTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
