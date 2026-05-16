<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { stringify } from 'devalue'
	import { networkConsensusUpgradeByChainIdAndUpgradeId } from '$/constants/NetworkUpgrades.ts'
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
	import NetworkConsensusUpgradeView from '$/views/NetworkConsensusUpgradeView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Consensus Upgrades',
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NetworkConsensusUpgrade>
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
			$: [
				Source.Constants_Internal,
			],
			[fieldName]: {
				$: [
					Source.Constants_Internal,
				],
				$limit: 512,
			},
		},
	)

	const upgradeSortValue = (row: Entity<typeof schema, EntityType.NetworkConsensusUpgrade>) => (
		row.activationBlock
		?? row.activationTimestamp
		?? row.activationEpoch
		?? 0
	)

	const upgrades = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.NetworkConsensusUpgrade>[] = (
				merged[fieldName] ?? []
			)
			return (
				rows
					.toSorted((a, b) => (
						upgradeSortValue(a) - upgradeSortValue(b)
					))
					.map((value) => ({
						value,
					}))
			)
		},
	)

	const upgradeListLink = (
		networkConsensusUpgradeEntity: Entity<typeof schema, EntityType.NetworkConsensusUpgrade>,
	) => {
		const { chainId } = networkConsensusUpgradeEntity[EntityMetaKey.Id].$network
		const { upgradeId } = networkConsensusUpgradeEntity[EntityMetaKey.Id]
		const constantUpgrade = networkConsensusUpgradeByChainIdAndUpgradeId[`${chainId}:${upgradeId}`]
		return {
			chainId,
			upgradeId,
			slug: constantUpgrade?.slug ?? networkConsensusUpgradeEntity.slug,
		}
	}
</script>


<EntitiesList
	entityType={EntityType.NetworkConsensusUpgrade}
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
			No consensus upgrades cataloged for this network yet.
		</p>
	{/snippet}

	{#snippet Item({ item: envelope })}
		{#if envelope}
			{@const link = upgradeListLink(envelope.value)}
			<NetworkConsensusUpgradeView
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
