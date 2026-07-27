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
	}: EntityListViewProps<EntityType.HederaAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaAccount}
	bind:open
	resource={
		selection({
			fields: {
				accountId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: hederaAccount })}
		{@const hederaAccountSelector = hederaAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.HederaAccount}
			entitySelector={hederaAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in hederaAccountSelector.$network ?
								String(caip2StringFromValue(hederaAccountSelector.$network.caip2))
							:
								String(hederaAccountSelector.$network.slug)
						),
						accountId: String(hederaAccountSelector.accountId),
					}
				)
			}
		>
			{#snippet Title()}
				{hederaAccountSelector.accountId || 'hedera account'}
			{/snippet}

			{#snippet Value()}
				{hederaAccount.$network.name || (hederaAccountSelector.$network.caip2 == null ? '' : `${hederaAccountSelector.$network.caip2.namespace}:${hederaAccountSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
