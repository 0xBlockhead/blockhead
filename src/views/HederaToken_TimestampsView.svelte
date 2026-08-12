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
	}: EntityListViewProps<EntityType.HederaToken_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaToken_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					$token: {
						fields: {
							tokenType: true,
							decimals: true,
						},
					},
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: hederaTokenTimestamp })}
		{@const hederaTokenTimestampSelector = hederaTokenTimestamp[EntityMetaKey.Selector]}
		{@const token = hederaTokenTimestampSelector.$token}
		<EntityView
			entityType={EntityType.HederaToken_Timestamp}
			entitySelector={hederaTokenTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in token.$network ?
								caip2StringFromValue(token.$network.caip2)
							:
								token.$network.slug
						),
						tokenId: token.tokenId,
						timestampMs: String(hederaTokenTimestampSelector.timestampMs),
						source: hederaTokenTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{hederaTokenTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{hederaTokenTimestampSelector.$token.tokenId || 'hedera token'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{hederaTokenTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
