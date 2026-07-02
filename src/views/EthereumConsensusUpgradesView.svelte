<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Ethereum consensus upgrades',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Ethereum consensus upgrades...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EthereumConsensusUpgrades-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EthereumConsensusUpgrade>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					name: true,
					upgradeId: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EthereumConsensusUpgrade}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(ethereumConsensusUpgrades)}
			{@const uniqueEthereumConsensusUpgrades = [...new Map(ethereumConsensusUpgrades.values.map((ethereumConsensusUpgrade) => [ethereumConsensusUpgrade[EntityMetaKey.SelectorKey], ethereumConsensusUpgrade])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EthereumConsensusUpgrade}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={ethereumConsensusUpgrades.values.length === uniqueEthereumConsensusUpgrades.length && ethereumConsensusUpgrades.totalCount != null && ethereumConsensusUpgrades.totalCount >= uniqueEthereumConsensusUpgrades.length ? ethereumConsensusUpgrades.totalCount : uniqueEthereumConsensusUpgrades.length}
				getKey={(ethereumConsensusUpgrade) => ethereumConsensusUpgrade[EntityMetaKey.SelectorKey]}
				items={uniqueEthereumConsensusUpgrades}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Ethereum consensus upgrades yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: ethereumConsensusUpgrade }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EthereumConsensusUpgrade> })}
					<EthereumConsensusUpgradeView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/consensus/[upgradeSlug]', {
								caip2: `${String(({ ...ethereumConsensusUpgrade.entitySelector, ...ethereumConsensusUpgrade }).$network.caip2.namespace)}:${String(({ ...ethereumConsensusUpgrade.entitySelector, ...ethereumConsensusUpgrade }).$network.caip2.reference)}`,
								upgradeSlug: String(({ ...ethereumConsensusUpgrade.entitySelector, ...ethereumConsensusUpgrade }).slug),
							})
						}
						selection={select(EntityType.EthereumConsensusUpgrade, ethereumConsensusUpgrade.entitySelector)}
						prefetched={ethereumConsensusUpgrade}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EthereumConsensusUpgrade}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
