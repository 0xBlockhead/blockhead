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
	}: EntityListViewProps<EntityType.Erc4337Paymaster_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337Paymaster_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				userOperationsCount: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: erc4337PaymasterTimestamp })}
		{@const erc4337PaymasterTimestampSelector = erc4337PaymasterTimestamp[EntityMetaKey.Selector]}
		{@const paymaster = erc4337PaymasterTimestampSelector.$paymaster}
		<EntityView
			entityType={EntityType.Erc4337Paymaster_Timestamp}
			entitySelector={erc4337PaymasterTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in paymaster.$network ?
								caip2StringFromValue(paymaster.$network.caip2)
							:
								paymaster.$network.slug
						),
						address: paymaster.address,
						timestampMs: String(erc4337PaymasterTimestampSelector.timestampMs),
						source: erc4337PaymasterTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{erc4337PaymasterTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{erc4337PaymasterTimestamp.userOperationsCount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{erc4337PaymasterTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
