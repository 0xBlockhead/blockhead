<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Execution forks',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EthereumExecutionUpgrade>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EthereumExecutionUpgradeView from '$/views/EthereumExecutionUpgradeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EthereumExecutionUpgrade}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
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

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ sources: [
						Source.Constants_Internal,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Constants_Internal,
						],
						limit: 512,
					},
				} }),
			)}
			{@const upgrades = derive(
				parent,
				(parent) => {
					const ethereumExecutionUpgrades: readonly Entity<typeof schema, EntityType.EthereumExecutionUpgrade>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						ethereumExecutionUpgrades
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EthereumExecutionUpgrade}
				{title}
				open={true}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Selector])}
				getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Selector])}
				resource={upgrades}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No execution upgrades yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					<EthereumExecutionUpgradeView
						selector={envelope.value[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
