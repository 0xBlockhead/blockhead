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
	}: EntityListViewProps<EntityType.ZcashShieldedPool> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZcashShieldedPool}
	bind:open
	resource={
		selection({
			fields: {
				pool: true,
				noteProtocol: true,
				activationNetworkUpgrade: true,
			},
		})
	}
>
	{#snippet Item({ item: zcashShieldedPool })}
		{@const zcashShieldedPoolSelector = zcashShieldedPool[EntityMetaKey.Selector]}
		{@const network = zcashShieldedPoolSelector.$network}
		<EntityView
			entityType={EntityType.ZcashShieldedPool}
			entitySelector={zcashShieldedPoolSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/shielded-pool/[pool=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						pool: zcashShieldedPoolSelector.pool,
					}
				)
			}
		>
			{#snippet Title()}
				{zcashShieldedPoolSelector.pool || 'Zcash shielded pool'}
			{/snippet}

			{#snippet Value()}
				{zcashShieldedPool.noteProtocol}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zcashShieldedPool.activationNetworkUpgrade}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
