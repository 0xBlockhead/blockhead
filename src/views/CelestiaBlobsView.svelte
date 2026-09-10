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
	}: EntityListViewProps<EntityType.CelestiaBlob> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaBlob}
	bind:open
	resource={
		selection({
			fields: {
				commitment: true,
				height: true,
				$namespace: {
					fields: {
						label: true,
						namespaceVersion: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: celestiaBlob })}
		{@const celestiaBlobSelector = celestiaBlob[EntityMetaKey.Selector]}
		{@const namespace = celestiaBlobSelector.$namespace}
		<EntityView
			entityType={EntityType.CelestiaBlob}
			entitySelector={celestiaBlobSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]/(celestiaNamespace)/blob/[height=nonNegativeBigInt]/[commitment=stringSegment]',
					{
						network: (
							'caip2' in namespace.$network.$network ?
								caip2StringFromValue(namespace.$network.$network.caip2)
							:
								namespace.$network.$network.slug
						),
						namespaceId: namespace.namespaceId,
						height: String(celestiaBlobSelector.height),
						commitment: celestiaBlobSelector.commitment,
					}
				)
			}
		>
			{#snippet Title()}
				{celestiaBlobSelector.commitment || 'celestia blob'}
			{/snippet}

			{#snippet Value()}
				{celestiaBlobSelector.height}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(celestiaBlob.$namespace.label ?? '') || celestiaBlobSelector.$namespace.namespaceId || 'celestia namespace'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
