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
	}: EntityListViewProps<EntityType.PolkadotAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAccount}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					accountId: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: polkadotAccount })}
		{@const polkadotAccountSelector = polkadotAccount[EntityMetaKey.Selector]}
		{@const network = polkadotAccountSelector.$network}
		<EntityView
			entityType={EntityType.PolkadotAccount}
			entitySelector={polkadotAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						accountId: polkadotAccountSelector.accountId,
					}
				)
			}
		>
			{#snippet Title()}
				{polkadotAccountSelector.accountId || 'Polkadot account'}
			{/snippet}

			{#snippet Value()}
				{polkadotAccountSelector.accountId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotAccount.$network.name || (polkadotAccount.$network.caip2 == null ? '' : `${polkadotAccount.$network.caip2.namespace}:${polkadotAccount.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
