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
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SolanaTokenAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTokenAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				amount: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaTokenAccountTimestamp })}
		{@const solanaTokenAccountTimestampSelector = solanaTokenAccountTimestamp[EntityMetaKey.Selector]}
		{@const tokenAccount = solanaTokenAccountTimestampSelector.$tokenAccount}
		<EntityView
			entityType={EntityType.SolanaTokenAccount_Timestamp}
			entitySelector={solanaTokenAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-account/[tokenAccountPubkey=stringSegment]/(solanaTokenAccount)/observations/[slot=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in tokenAccount.$network ?
								caip2StringFromValue(tokenAccount.$network.caip2)
							:
								tokenAccount.$network.slug
						),
						tokenAccountPubkey: tokenAccount.tokenAccountPubkey,
						slot: String(solanaTokenAccountTimestampSelector.slot),
						source: solanaTokenAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{solanaTokenAccountTimestampSelector.slot}
			{/snippet}

			{#snippet Value()}
				{solanaTokenAccountTimestamp.amount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{solanaTokenAccountTimestamp.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
