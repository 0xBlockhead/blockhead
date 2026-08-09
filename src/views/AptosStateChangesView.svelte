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
	}: EntityListViewProps<EntityType.AptosStateChange> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosStateChange}
	bind:open
	resource={
		selection({
			...{
				fields: {
					changeKind: true,
					changeIndex: true,
					$transaction: {
						fields: {
							hash: true,
							transactionKind: true,
							version: true,
							sender: true,
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: aptosStateChange })}
		{@const aptosStateChangeSelector = aptosStateChange[EntityMetaKey.Selector]}
		{@const transaction = aptosStateChangeSelector.$transaction}
		<EntityView
			entityType={EntityType.AptosStateChange}
			entitySelector={aptosStateChangeSelector}
			href={
				'version' in transaction ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/version/[version=nonNegativeBigInt]/(aptosTransaction)/state-change/[changeIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in transaction.$network.$network ?
									caip2StringFromValue(transaction.$network.$network.caip2)
								:
									transaction.$network.$network.slug
							),
							version: String(transaction.version),
							changeIndex: String(aptosStateChangeSelector.changeIndex),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{aptosStateChange.changeKind || 'aptos state change'}
			{/snippet}

			{#snippet Value()}
				{aptosStateChangeSelector.changeIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosStateChange.$transaction.hash || String(aptosStateChange.$transaction.version) || 'aptos transaction'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
