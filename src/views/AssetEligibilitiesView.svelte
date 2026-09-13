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
		id = 'AssetEligibilities-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AssetEligibility> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AssetEligibility}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				canHold: true,
				canSend: true,
				canReceive: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: assetEligibility })}
		{@const assetEligibilitySelector = assetEligibility[EntityMetaKey.Selector]}
		{@const assetInstance = assetEligibilitySelector.$assetInstance}
		<EntityView
			entityType={EntityType.AssetEligibility}
			entitySelector={assetEligibilitySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/eligibility/[namespace=stringSegment]/[reference=stringSegment]/[accountAddress=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							assetInstance.$network.caip2 !== undefined ?
								caip2StringFromValue(assetInstance.$network.caip2)
							:
								assetInstance.$network.slug
						),
						kind: assetInstance.kind,
						assetKey: assetInstance.assetKey,
						namespace: assetEligibilitySelector.$account.caip10.namespace,
						reference: assetEligibilitySelector.$account.caip10.reference,
						accountAddress: assetEligibilitySelector.$account.caip10.accountAddress,
						timestampMs: String(assetEligibilitySelector.timestampMs),
						source: assetEligibilitySelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{assetEligibilitySelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(assetEligibility.canHold ?? ''), String(assetEligibility.canSend ?? ''), String(assetEligibility.canReceive ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{assetEligibilitySelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
