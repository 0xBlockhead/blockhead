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
	}: EntityListViewProps<EntityType.TrustedIssuer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TrustedIssuer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: trustedIssuer })}
		{@const trustedIssuerSelector = trustedIssuer[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TrustedIssuer}
			entitySelector={trustedIssuerSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/issuer/[issuerKey=stringSegment]',
					{
						network: (
							'caip2' in trustedIssuerSelector.$profile.$assetInstance.$network ?
								caip2StringFromValue(trustedIssuerSelector.$profile.$assetInstance.$network.caip2)
							:
								trustedIssuerSelector.$profile.$assetInstance.$network.slug
						),
						kind: trustedIssuerSelector.$profile.$assetInstance.kind,
						assetKey: trustedIssuerSelector.$profile.$assetInstance.assetKey,
						issuerKey: trustedIssuerSelector.issuerKey,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
