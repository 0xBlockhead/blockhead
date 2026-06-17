<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Consensus forks',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EthereumConsensusUpgrade>
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


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EthereumConsensusUpgrade}
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
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: [Source.Constants_Internal],
						limit: 512,
					})}
				placeholderText="Loading upgrades…"
			>
				{#snippet children(upgrades)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EthereumConsensusUpgrade}
				{title}
				open={true}
				getKey={(upgrade) => stringify(upgrade.entitySelector)}
				getSortValue={(upgrade) => stringify(upgrade.entitySelector)}
				items={upgrades.entities}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No consensus upgrades yet.
					</p>
				{/snippet}

				{#snippet Item({ item: upgrade })}
					<EthereumConsensusUpgradeView
						selector={upgrade.entitySelector}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
