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
	}: EntityListViewProps<EntityType.CelestiaBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaBlock}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				timestampMs: true,
				hash: true,
			},
		})
	}
>
	{#snippet Item({ item: celestiaBlock })}
		{@const celestiaBlockSelector = celestiaBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CelestiaBlock}
			entitySelector={celestiaBlockSelector}
			href={
				'height' in celestiaBlockSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/block-height/[height=nonNegativeBigInt]',
						{
							network: (
								'caip2' in celestiaBlockSelector.$network.$network ?
									caip2StringFromValue(celestiaBlockSelector.$network.$network.caip2)
								:
									celestiaBlockSelector.$network.$network.slug
							),
							height: String(celestiaBlockSelector.height),
						}
					)
				:
					'hash' in celestiaBlockSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/celestia/block-hash/[hash=stringSegment]',
							{
								network: (
									'caip2' in celestiaBlockSelector.$network.$network ?
										caip2StringFromValue(celestiaBlockSelector.$network.$network.caip2)
									:
										celestiaBlockSelector.$network.$network.slug
								),
								hash: celestiaBlockSelector.hash,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{celestiaBlock.height}
			{/snippet}

			{#snippet Value()}
				{celestiaBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
