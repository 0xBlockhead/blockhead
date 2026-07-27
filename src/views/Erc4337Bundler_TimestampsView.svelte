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
	}: EntityListViewProps<EntityType.Erc4337Bundler_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337Bundler_Timestamp}
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
	{#snippet Item({ item: erc4337BundlerTimestamp })}
		{@const erc4337BundlerTimestampSelector = erc4337BundlerTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Erc4337Bundler_Timestamp}
			entitySelector={erc4337BundlerTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in erc4337BundlerTimestampSelector.$bundler.$network ?
								String(caip2StringFromValue(erc4337BundlerTimestampSelector.$bundler.$network.caip2))
							:
								String(erc4337BundlerTimestampSelector.$bundler.$network.slug)
						),
						address: String(erc4337BundlerTimestampSelector.$bundler.address),
						timestampMs: String(erc4337BundlerTimestampSelector.timestampMs),
						source: String(erc4337BundlerTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{String(erc4337BundlerTimestampSelector.timestampMs) || 'ERC-4337 bundler timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(erc4337BundlerTimestamp.userOperationsCount ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{erc4337BundlerTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
