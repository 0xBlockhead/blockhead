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
	}: EntityListViewProps<EntityType.HederaNft> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNft}
	bind:open
	resource={
		selection({
			...{
				fields: {
					serialNumber: true,
					$token: {
						fields: {
							tokenType: true,
							decimals: true,
						},
					},
					createdTimestamp: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: hederaNft })}
		{@const hederaNftSelector = hederaNft[EntityMetaKey.Selector]}
		{@const token = hederaNftSelector.$token}
		<EntityView
			entityType={EntityType.HederaNft}
			entitySelector={hederaNftSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/nft/[serialNumber=nonNegativeBigInt]',
					{
						network: (
							'caip2' in token.$network ?
								caip2StringFromValue(token.$network.caip2)
							:
								token.$network.slug
						),
						tokenId: token.tokenId,
						serialNumber: String(hederaNftSelector.serialNumber),
					}
				)
			}
		>
			{#snippet Title()}
				{hederaNftSelector.serialNumber}
			{/snippet}

			{#snippet Value()}
				{hederaNftSelector.$token.tokenId || 'hedera token'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{hederaNft.createdTimestamp ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
