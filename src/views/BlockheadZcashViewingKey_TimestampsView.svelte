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
		title = 'Blockhead Zcash viewing key observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadZcashViewingKey_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZcashViewingKey_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					lastScannedHeight: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadZcashViewingKeyTimestamp })}
		{@const blockheadZcashViewingKeyTimestampSelector = blockheadZcashViewingKeyTimestamp[EntityMetaKey.Selector]}
		{@const viewingKey = blockheadZcashViewingKeyTimestampSelector.$viewingKey}
		<EntityView
			entityType={EntityType.BlockheadZcashViewingKey_Timestamp}
			entitySelector={blockheadZcashViewingKeyTimestampSelector}
			href={
				resolve(
					'/~/zcash/wallet/[walletId=stringSegment]/viewing-key/[keyFingerprint=stringSegment]/(blockheadZcashViewingKey)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						walletId: viewingKey.walletId,
						keyFingerprint: viewingKey.keyFingerprint,
						timestampMs: String(blockheadZcashViewingKeyTimestampSelector.timestampMs),
						source: blockheadZcashViewingKeyTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadZcashViewingKeyTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadZcashViewingKeyTimestamp.lastScannedHeight ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadZcashViewingKeyTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
