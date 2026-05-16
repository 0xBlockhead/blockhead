<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { stringify } from 'devalue'
	import { networkExecutionUpgradeByChainIdAndUpgradeId } from '$/constants/NetworkUpgrades.ts'
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
	import NetworkExecutionUpgradeView from '$/views/NetworkExecutionUpgradeView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Execution Upgrades',
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NetworkExecutionUpgrade>
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

	const upgradeSortValue = (row: Entity<typeof schema, EntityType.NetworkExecutionUpgrade>) => (
		row.activationBlock
		?? row.activationTimestamp
		?? row.activationEpoch
		?? 0
	)

	const upgrades = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.NetworkExecutionUpgrade>[] = (
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
		networkExecutionUpgradeEntity: Entity<typeof schema, EntityType.NetworkExecutionUpgrade>,
	) => {
		const { chainId } = networkExecutionUpgradeEntity[EntityMetaKey.Id].$network
		const { upgradeId } = networkExecutionUpgradeEntity[EntityMetaKey.Id]
		const constantUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[`${chainId}:${upgradeId}`]
		return {
			chainId,
			upgradeId,
			slug: constantUpgrade?.slug ?? networkExecutionUpgradeEntity.slug,
		}
	}
</script>


<EntitiesList
	entityType={EntityType.NetworkExecutionUpgrade}
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
			No execution upgrades cataloged for this network yet.
		</p>
	{/snippet}

	{#snippet Item({ item: envelope })}
		{#if envelope}
			{@const link = upgradeListLink(envelope.value)}
			<NetworkExecutionUpgradeView
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
