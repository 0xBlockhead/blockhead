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
	}: EntityListViewProps<EntityType.SuiPackageVersion> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiPackageVersion}
	bind:open
	resource={
		selection({
			fields: {
				version: true,
				packageId: true,
				$package: true,
			},
		})
	}
>
	{#snippet Item({ item: suiPackageVersion })}
		{@const suiPackageVersionSelector = suiPackageVersion[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiPackageVersion}
			entitySelector={suiPackageVersionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/package/[packageId=stringSegment]/version/[version=nonNegativeBigInt]/[digest=stringSegment]',
					{
						network: (
							suiPackageVersionSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(suiPackageVersionSelector.$network.$network.caip2)
							:
								suiPackageVersionSelector.$network.$network.slug
						),
						packageId: suiPackageVersionSelector.packageId,
						version: String(suiPackageVersionSelector.version),
						digest: suiPackageVersionSelector.digest,
					}
				)
			}
		>
			{#snippet Title()}
				{suiPackageVersionSelector.version}
			{/snippet}

			{#snippet Value()}
				{suiPackageVersionSelector.packageId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{suiPackageVersion.$package == null ? '' : suiPackageVersion.$package.originalPackageId || 'Sui package'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
