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
		title = 'Ethereum execution upgrades',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Ethereum execution upgrades...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EthereumExecutionUpgrades-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EthereumExecutionUpgrade>
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
	import EthereumExecutionUpgradeView from '$/views/EthereumExecutionUpgradeView.svelte'
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
				entityType={EntityType.EthereumExecutionUpgrade}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(ethereumExecutionUpgrades)}
			{@const uniqueEthereumExecutionUpgrades = [...new Map(ethereumExecutionUpgrades.values.map((ethereumExecutionUpgrade) => [ethereumExecutionUpgrade[EntityMetaKey.SelectorKey], ethereumExecutionUpgrade])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EthereumExecutionUpgrade}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={ethereumExecutionUpgrades.values.length === uniqueEthereumExecutionUpgrades.length && ethereumExecutionUpgrades.totalCount != null && ethereumExecutionUpgrades.totalCount >= uniqueEthereumExecutionUpgrades.length ? ethereumExecutionUpgrades.totalCount : uniqueEthereumExecutionUpgrades.length}
				getKey={(ethereumExecutionUpgrade) => ethereumExecutionUpgrade[EntityMetaKey.SelectorKey]}
				items={uniqueEthereumExecutionUpgrades}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Ethereum execution upgrades yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: ethereumExecutionUpgrade }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EthereumExecutionUpgrade> })}
					<EthereumExecutionUpgradeView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/execution/[upgradeSlug]', {
								caip2: `${String(({ ...ethereumExecutionUpgrade.entitySelector, ...ethereumExecutionUpgrade }).$network.caip2.namespace)}:${String(({ ...ethereumExecutionUpgrade.entitySelector, ...ethereumExecutionUpgrade }).$network.caip2.reference)}`,
								upgradeSlug: String(({ ...ethereumExecutionUpgrade.entitySelector, ...ethereumExecutionUpgrade }).slug),
							})
						}
						selection={select(EntityType.EthereumExecutionUpgrade, ethereumExecutionUpgrade.entitySelector)}
						prefetched={ethereumExecutionUpgrade}
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
		entityType={EntityType.EthereumExecutionUpgrade}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
