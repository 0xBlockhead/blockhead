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
		{@const factory = erc4337AccountFactoryTimestampSelector.$factory}
		<EntityView
			entityType={EntityType.Erc4337AccountFactory_Timestamp}
			entitySelector={erc4337AccountFactoryTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in factory.$network ?
								caip2StringFromValue(factory.$network.caip2)
							:
								factory.$network.slug
						),
						address: factory.address,
						timestampMs: String(erc4337AccountFactoryTimestampSelector.timestampMs),
						source: erc4337AccountFactoryTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{erc4337AccountFactoryTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{erc4337AccountFactoryTimestamp.userOperationsCount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[erc4337AccountFactoryTimestampSelector.source, (erc4337AccountFactoryTimestamp.smartAccountsCount != null ? String(erc4337AccountFactoryTimestamp.smartAccountsCount) + ' smart accounts' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
