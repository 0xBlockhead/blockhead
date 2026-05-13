<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { stringify } from 'devalue'
	import { ethereumUpgradeByChainIdAndUpgradeId } from '$/constants/EthereumUpgrades.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkUpgradeView from '$/views/NetworkUpgradeView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Upgrades',
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NetworkUpgrade>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const parentEntityType = $derived(entityFieldReference.entityType)
	const parentEntityId = $derived(entityFieldReference.entityId)
	const fieldName = $derived(entityFieldReference.fieldName)

	const parentEntity = useEntity(
		parentEntityType,
		parentEntityId,
		{
			[fieldName]: {
				$: [
					Source.Constants_Internal,
				],
			},
		},
	)

	const upgradeSortValue = (row: Entity<typeof schema, EntityType.NetworkUpgrade>) => (
		row.activationBlock
		?? row.activationTimestamp
		?? row.activationEpoch
		?? 0
	)

	const upgrades = derive(
		parentEntity,
		(merged) => (
			(
				(
					merged[fieldName as keyof typeof merged]
					?? []
				) as Entity<typeof schema, EntityType.NetworkUpgrade>[]
			)
				.toSorted((a, b) => (
					upgradeSortValue(a) - upgradeSortValue(b)
				))
				.map((value) => ({
					value,
				}))
		),
	)

	const upgradeListLink = (row: Entity<typeof schema, EntityType.NetworkUpgrade>) => {
		const { chainId } = row[EntityMetaKey.Id].$network
		const { upgradeId } = row[EntityMetaKey.Id]
		const catalog = ethereumUpgradeByChainIdAndUpgradeId[`${chainId}:${upgradeId}`]
		return {
			chainId,
			upgradeId,
			slug: catalog?.slug ?? row.slug,
		}
	}
</script>


<EntitiesList
	entityType={EntityType.NetworkUpgrade}
	{title}
	bind:open
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => upgradeSortValue(envelope.value)}
	placeholderKeys={new SvelteSet()}
	resource={upgrades}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No upgrades cataloged for this network yet.
		</p>
	{/snippet}

	{#snippet Item({ item: envelope })}
		{#if envelope}
			{@const link = upgradeListLink(envelope.value)}
			<NetworkUpgradeView
				entityId={envelope.value[EntityMetaKey.Id]}
				href={resolve(
					'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
					{
						networkId: String(link.chainId),
						upgradeSlug: link.slug ?? link.upgradeId,
					},
				)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
