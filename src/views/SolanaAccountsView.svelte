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
		title = 'Accounts',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SolanaAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaAccount}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				pubkey: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaAccount })}
		{@const solanaAccountSelector = solanaAccount[EntityMetaKey.Selector]}
		{@const network = solanaAccountSelector.$network}
		<EntityView
			entityType={EntityType.SolanaAccount}
			entitySelector={solanaAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						accountId: solanaAccountSelector.pubkey,
					}
				)
			}
		>
			{#snippet Title()}
				{solanaAccountSelector.pubkey || 'solana account'}
			{/snippet}

			{#snippet Value()}
				{solanaAccount.$network.name || (solanaAccountSelector.$network.caip2 == null ? '' : `${solanaAccountSelector.$network.caip2.namespace}:${solanaAccountSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
