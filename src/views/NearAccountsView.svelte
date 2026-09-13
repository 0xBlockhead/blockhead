<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NearAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearAccount}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.NearRpc_JsonRpc,
				Source.NearBlocks_Rest,
			],
			fields: {
				accountId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: nearAccount })}
		{@const nearAccountSelector = nearAccount[EntityMetaKey.Selector]}
		{@const network = nearAccountSelector.$network}
		<EntityView
			entityType={EntityType.NearAccount}
			entitySelector={nearAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						accountId: nearAccountSelector.accountId,
					}
				)
			}
		>
			{#snippet Title()}
				{nearAccountSelector.accountId || 'near account'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearAccount.$network.name || (nearAccount.$network.caip2 == null ? '' : `${nearAccount.$network.caip2.namespace}:${nearAccount.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
