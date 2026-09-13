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
	}: EntityListViewProps<EntityType.CelestiaBlobOccurrence> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaBlobOccurrence}
	bind:open
	resource={
		selection({
			fields: {
				index: true,
				$block: {
					fields: {
						height: true,
						timestampMs: true,
						hash: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: celestiaBlobOccurrence })}
		{@const celestiaBlobOccurrenceSelector = celestiaBlobOccurrence[EntityMetaKey.Selector]}
		{@const block = celestiaBlobOccurrenceSelector.$block}
		{@const namespace = celestiaBlobOccurrenceSelector.$namespace}
		<EntityView
			entityType={EntityType.CelestiaBlobOccurrence}
			entitySelector={celestiaBlobOccurrenceSelector}
			href={
				block !== undefined
				&& block.height !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/block-height/[height=nonNegativeBigInt]/(celestiaBlock)/occurrence/[index=nonNegativeInteger]',
						{
							network: (
								block.$network.$network.caip2 !== undefined ?
									caip2StringFromValue(block.$network.$network.caip2)
								:
									block.$network.$network.slug
							),
							height: String(block.height),
							index: String(celestiaBlobOccurrenceSelector.index),
						}
					)
				:
					celestiaBlobOccurrenceSelector.height !== undefined
					&& namespace !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]/(celestiaNamespace)/occurrence/[height=nonNegativeBigInt]/[index=nonNegativeInteger]',
							{
								network: (
									namespace.$network.$network.caip2 !== undefined ?
										caip2StringFromValue(namespace.$network.$network.caip2)
									:
										namespace.$network.$network.slug
								),
								namespaceId: namespace.namespaceId,
								height: String(celestiaBlobOccurrenceSelector.height),
								index: String(celestiaBlobOccurrenceSelector.index),
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{`Blob occurrence #${celestiaBlobOccurrenceSelector.index}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(celestiaBlobOccurrence.$block.height) || celestiaBlobOccurrence.$block.hash || 'celestia block'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
