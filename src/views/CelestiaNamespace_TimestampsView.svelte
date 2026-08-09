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
	}: EntityListViewProps<EntityType.CelestiaNamespace_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaNamespace_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					height: true,
					blobCount: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: celestiaNamespaceTimestamp })}
		{@const celestiaNamespaceTimestampSelector = celestiaNamespaceTimestamp[EntityMetaKey.Selector]}
		{@const namespace = celestiaNamespaceTimestampSelector.$namespace}
		<EntityView
			entityType={EntityType.CelestiaNamespace_Timestamp}
			entitySelector={celestiaNamespaceTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]/(celestiaNamespace)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in namespace.$network.$network ?
								caip2StringFromValue(namespace.$network.$network.caip2)
							:
								namespace.$network.$network.slug
						),
						namespaceId: namespace.namespaceId,
						timestampMs: String(celestiaNamespaceTimestampSelector.timestampMs),
						source: celestiaNamespaceTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{celestiaNamespaceTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(celestiaNamespaceTimestamp.height ?? ''), String(celestiaNamespaceTimestamp.blobCount ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{celestiaNamespaceTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
