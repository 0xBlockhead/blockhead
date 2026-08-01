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
	}: EntityListViewProps<EntityType.Erc4337SmartAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337SmartAccount_Timestamp}
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
	{#snippet Item({ item: erc4337SmartAccountTimestamp })}
		{@const erc4337SmartAccountTimestampSelector = erc4337SmartAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = erc4337SmartAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.Erc4337SmartAccount_Timestamp}
			entitySelector={erc4337SmartAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						address: account.address,
						timestampMs: String(erc4337SmartAccountTimestampSelector.timestampMs),
						source: erc4337SmartAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{erc4337SmartAccountTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{erc4337SmartAccountTimestamp.userOperationsCount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{erc4337SmartAccountTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
