<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		title = 'Consensus forks',
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			...(open && {
				[entityFieldReference.fieldName]: {
					$: [
						Source.Constants_Internal,
					],
					$limit: 512,
				},
			}),
		},
	)

	const upgradeSortValue = (row: Entity<typeof schema, EntityType.NetworkConsensusUpgrade>) => (
		row.activationBlock
		?? row.activationTimestamp
		?? row.activationEpoch
		?? 0
	)

	const upgrades = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.NetworkConsensusUpgrade>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			return (
				rows
					.toSorted((a, b) => (
						upgradeSortValue(b) - upgradeSortValue(a)
					))
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkConsensusUpgradeView from '$/views/NetworkConsensusUpgradeView.svelte'
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
	{#snippet TypeAnnotationTooltip()}
		<p>
			Consensus-layer forks change beacon rules—slot timing, signature domains, validator set caps, or light-client assumptions.
		</p>
		<p>
			Activations are anchored to an epoch (and sometimes a block height on linked execution chains) published in network upgrade metadata.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No consensus upgrades yet.
		</p>
	{/snippet}

	{#snippet Item({ item: envelope })}
		{#if envelope}
			{@const slug = envelope.value.slug ?? envelope.value[EntityMetaKey.Id].upgradeId}
			<NetworkConsensusUpgradeView
				entityId={envelope.value[EntityMetaKey.Id]}
				href={resolve(
					'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
					{
						networkId: String(envelope.value[EntityMetaKey.Id].$network.chainId),
						upgradeSlug: slug,
					},
				)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
