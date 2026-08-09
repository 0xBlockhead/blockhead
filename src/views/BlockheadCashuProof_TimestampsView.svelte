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
	}: EntityListViewProps<EntityType.BlockheadCashuProof_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuProof_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					state: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadCashuProofTimestamp })}
		{@const blockheadCashuProofTimestampSelector = blockheadCashuProofTimestamp[EntityMetaKey.Selector]}
		{@const proof = blockheadCashuProofTimestampSelector.$proof}
		<EntityView
			entityType={EntityType.BlockheadCashuProof_Timestamp}
			entitySelector={blockheadCashuProofTimestampSelector}
			href={
				resolve(
					'/~/cashu/wallet/[walletId=stringSegment]/mint/[mintUrl=stringSegment]/keyset/[keysetId=stringSegment]/proof/[secretHash=stringSegment]/(blockheadCashuProof)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						walletId: proof.walletId,
						mintUrl: proof.mintUrl,
						keysetId: proof.keysetId,
						secretHash: proof.secretHash,
						timestampMs: String(blockheadCashuProofTimestampSelector.timestampMs),
						source: blockheadCashuProofTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadCashuProofTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadCashuProofTimestamp.state}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadCashuProofTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
