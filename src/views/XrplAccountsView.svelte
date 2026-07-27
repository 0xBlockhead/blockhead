<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.XrplAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplAccount}
	bind:open
	resource={
		selection({
			fields: {
				account: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: xrplAccount })}
		{@const xrplAccountSelector = xrplAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XrplAccount}
			entitySelector={xrplAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in xrplAccountSelector.$network ?
								String(caip2StringFromValue(xrplAccountSelector.$network.caip2))
							:
								String(xrplAccountSelector.$network.slug)
						),
						accountId: String(xrplAccountSelector.account),
					}
				)
			}
		>
			{#snippet Title()}
				{xrplAccountSelector.account || 'XRPL account'}
			{/snippet}

			{#snippet Value()}
				{xrplAccount.$network.name || (xrplAccountSelector.$network.caip2 == null ? '' : `${xrplAccountSelector.$network.caip2.namespace}:${xrplAccountSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
