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
			...{
				fields: {
					timestampMs: true,
					userOperationsCount: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: erc4337BundlerTimestamp })}
		{@const erc4337BundlerTimestampSelector = erc4337BundlerTimestamp[EntityMetaKey.Selector]}
		{@const bundler = erc4337BundlerTimestampSelector.$bundler}
		<EntityView
			entityType={EntityType.Erc4337Bundler_Timestamp}
			entitySelector={erc4337BundlerTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in bundler.$network ?
								caip2StringFromValue(bundler.$network.caip2)
							:
								bundler.$network.slug
						),
						address: bundler.address,
						timestampMs: String(erc4337BundlerTimestampSelector.timestampMs),
						source: erc4337BundlerTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{erc4337BundlerTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{erc4337BundlerTimestamp.userOperationsCount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{erc4337BundlerTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
