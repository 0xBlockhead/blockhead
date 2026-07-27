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
	}: EntityListViewProps<EntityType.Erc4337AccountFactory_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337AccountFactory_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				userOperationsCount: true,
				source: true,
				smartAccountsCount: true,
			},
		})
	}
>
	{#snippet Item({ item: erc4337AccountFactoryTimestamp })}
		{@const erc4337AccountFactoryTimestampSelector = erc4337AccountFactoryTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Erc4337AccountFactory_Timestamp}
			entitySelector={erc4337AccountFactoryTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in erc4337AccountFactoryTimestampSelector.$factory.$network ?
								String(caip2StringFromValue(erc4337AccountFactoryTimestampSelector.$factory.$network.caip2))
							:
								String(erc4337AccountFactoryTimestampSelector.$factory.$network.slug)
						),
						address: String(erc4337AccountFactoryTimestampSelector.$factory.address),
						timestampMs: String(erc4337AccountFactoryTimestampSelector.timestampMs),
						source: String(erc4337AccountFactoryTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{String(erc4337AccountFactoryTimestampSelector.timestampMs) || 'ERC-4337 account factory timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(erc4337AccountFactoryTimestamp.userOperationsCount ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[erc4337AccountFactoryTimestampSelector.source, (String(erc4337AccountFactoryTimestamp.smartAccountsCount ?? '') ? String(erc4337AccountFactoryTimestamp.smartAccountsCount ?? '') + ' smart accounts' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
