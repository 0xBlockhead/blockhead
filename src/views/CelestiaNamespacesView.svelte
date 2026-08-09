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
	}: EntityListViewProps<EntityType.CelestiaNamespace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaNamespace}
	bind:open
	resource={
		selection({
			...{
				fields: {
					label: true,
					namespaceVersion: true,
					namespaceId: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: celestiaNamespace })}
		{@const celestiaNamespaceSelector = celestiaNamespace[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CelestiaNamespace}
			entitySelector={celestiaNamespaceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]',
					{
						network: (
							'caip2' in celestiaNamespaceSelector.$network.$network ?
								caip2StringFromValue(celestiaNamespaceSelector.$network.$network.caip2)
							:
								celestiaNamespaceSelector.$network.$network.slug
						),
						namespaceId: celestiaNamespaceSelector.namespaceId,
					}
				)
			}
		>
			{#snippet Title()}
				{(celestiaNamespace.label ?? '') || celestiaNamespaceSelector.namespaceId || 'celestia namespace'}
			{/snippet}

			{#snippet Value()}
				{celestiaNamespace.namespaceVersion ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
