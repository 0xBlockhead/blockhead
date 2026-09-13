<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		id = 'XrplLedgerEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.XrplLedgerEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplLedgerEntry}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplLedgerEntry })}
		{@const xrplLedgerEntrySelector = xrplLedgerEntry[EntityMetaKey.Selector]}
		{@const ledger = xrplLedgerEntrySelector.$ledger}
		<EntityView
			entityType={EntityType.XrplLedgerEntry}
			entitySelector={xrplLedgerEntrySelector}
			href={
				ledger.ledgerHash !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/hash/[ledgerHash=stringSegment]/(xrplLedger)/entry/[entryHash=stringSegment]',
						{
							network: (
								ledger.$network.caip2 !== undefined ?
									caip2StringFromValue(ledger.$network.caip2)
								:
									ledger.$network.slug
							),
							ledgerHash: ledger.ledgerHash,
							entryHash: xrplLedgerEntrySelector.entryHash,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				XRPL ledger entry
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
