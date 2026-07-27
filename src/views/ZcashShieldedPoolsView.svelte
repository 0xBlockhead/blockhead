<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'


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
		<EntityView
			entityType={EntityType.ZcashShieldedPool}
			entitySelector={zcashShieldedPoolSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/shielded-pool/[pool=stringSegment]',
					{
						network: (
							'caip2' in zcashShieldedPoolSelector.$network ?
								String(caip2StringFromValue(zcashShieldedPoolSelector.$network.caip2))
							:
								String(zcashShieldedPoolSelector.$network.slug)
						),
						pool: String(zcashShieldedPoolSelector.pool),
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
