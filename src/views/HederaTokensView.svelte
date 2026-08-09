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
	}: EntityListViewProps<EntityType.HederaToken> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaToken}
	bind:open
	resource={
		selection({
			...{
				fields: {
					tokenId: true,
					tokenType: true,
					decimals: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: hederaToken })}
		{@const hederaTokenSelector = hederaToken[EntityMetaKey.Selector]}
		{@const network = hederaTokenSelector.$network}
		<EntityView
			entityType={EntityType.HederaToken}
			entitySelector={hederaTokenSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						tokenId: hederaTokenSelector.tokenId,
					}
				)
			}
		>
			{#snippet Title()}
				{hederaTokenSelector.tokenId || 'hedera token'}
			{/snippet}

			{#snippet Value()}
				{hederaToken.tokenType}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{hederaToken.decimals ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
