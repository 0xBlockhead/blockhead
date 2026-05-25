<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Props
	let {
		entityFieldReference,
		title = 'Consensus forks',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NetworkConsensusUpgrade>
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkConsensusUpgradeView from '$/views/NetworkConsensusUpgradeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NetworkConsensusUpgrade}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
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

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Constants_Internal,
						],
						$limit: 512,
					},
				},
			)}
			{@const upgrades = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.NetworkConsensusUpgrade>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.NetworkConsensusUpgrade}
				{title}
				open={true}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				resource={upgrades}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No consensus upgrades yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					{@const slug = envelope.value.slug ?? envelope.value[EntityMetaKey.Id].upgradeId}
					<NetworkConsensusUpgradeView
						entityId={envelope.value[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
