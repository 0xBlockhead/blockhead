<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		title = 'Execution forks',
		open = $bindable(true),
		collapsible = true,
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkExecutionUpgradeView from '$/views/NetworkExecutionUpgradeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NetworkExecutionUpgrade}
	{title}
	bind:open
	{collapsible}
	{...entitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Execution upgrades change EVM rules and precompiles—gas costs, opcodes, and withdrawal or proof layouts.
		</p>
		<p>
			Activation is usually pinned to a block or timestamp; cards summarize slug and catalog metadata for each fork.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No execution upgrades yet.
		</p>
	{/snippet}

	{#snippet body()}
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
					const rows: Entity<typeof schema, EntityType.NetworkExecutionUpgrade>[] = (
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
				entityType={EntityType.NetworkExecutionUpgrade}
				{title}
				open={true}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				placeholderKeys={new SvelteSet()}
				resource={upgrades}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No execution upgrades yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					{#if envelope}
						{@const slug = envelope.value.slug ?? envelope.value[EntityMetaKey.Id].upgradeId}
						<NetworkExecutionUpgradeView
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
		{/if}
	{/snippet}
</EntitiesList>
