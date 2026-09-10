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
	}: EntityListViewProps<EntityType.AptosBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosBlock}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosBlock })}
		{@const aptosBlockSelector = aptosBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosBlock}
			entitySelector={aptosBlockSelector}
			href={
				'height' in aptosBlockSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/height/[height=nonNegativeBigInt]',
						{
							network: (
								'caip2' in aptosBlockSelector.$network.$network ?
									caip2StringFromValue(aptosBlockSelector.$network.$network.caip2)
								:
									aptosBlockSelector.$network.$network.slug
							),
							height: String(aptosBlockSelector.height),
						}
					)
				:
					'version' in aptosBlockSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/version/[version=nonNegativeBigInt]',
							{
								network: (
									'caip2' in aptosBlockSelector.$network.$network ?
										caip2StringFromValue(aptosBlockSelector.$network.$network.caip2)
									:
										aptosBlockSelector.$network.$network.slug
								),
								version: String(aptosBlockSelector.version),
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{aptosBlock.height}
			{/snippet}

			{#snippet Value()}
				{aptosBlock.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
