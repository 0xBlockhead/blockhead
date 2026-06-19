<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Execution forks',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EthereumExecutionUpgrade>
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
			<ResourceBoundary
				resource={selection({
						sources: [Source.Constants_Internal],
						limit: 512,
					})}
				placeholderText="Loading upgrades…"
			>
				{#snippet children(upgrades)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EthereumExecutionUpgrade}
				{title}
				open={true}
				getKey={(upgrade) => stringify(upgrade.entitySelector)}
				getSortValue={(upgrade) => stringify(upgrade.entitySelector)}
				items={upgrades.entities}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No execution upgrades yet.
					</p>
				{/snippet}

				{#snippet Item({ item: upgrade })}
					<EthereumExecutionUpgradeView
						selection={select(EntityType.EthereumExecutionUpgrade, upgrade.entitySelector)}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
