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
		title = 'Ethereum network upgrades',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Ethereum network upgrades...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EthereumNetworkUpgrades-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EthereumNetworkUpgrade>
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
	import EthereumNetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
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
				entityType={EntityType.EthereumNetworkUpgrade}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(ethereumNetworkUpgrades)}
			{@const uniqueEthereumNetworkUpgrades = [...new Map(ethereumNetworkUpgrades.values.map((ethereumNetworkUpgrade) => [ethereumNetworkUpgrade[EntityMetaKey.SelectorKey], ethereumNetworkUpgrade])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EthereumNetworkUpgrade}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={ethereumNetworkUpgrades.values.length === uniqueEthereumNetworkUpgrades.length && ethereumNetworkUpgrades.totalCount != null && ethereumNetworkUpgrades.totalCount >= uniqueEthereumNetworkUpgrades.length ? ethereumNetworkUpgrades.totalCount : uniqueEthereumNetworkUpgrades.length}
				getKey={(ethereumNetworkUpgrade) => ethereumNetworkUpgrade[EntityMetaKey.SelectorKey]}
				items={uniqueEthereumNetworkUpgrades}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Ethereum network upgrades yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: ethereumNetworkUpgrade }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EthereumNetworkUpgrade> })}
					<EthereumNetworkUpgradeView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
								caip2: `${String(({ ...ethereumNetworkUpgrade.entitySelector, ...ethereumNetworkUpgrade }).$network.caip2.namespace)}:${String(({ ...ethereumNetworkUpgrade.entitySelector, ...ethereumNetworkUpgrade }).$network.caip2.reference)}`,
								upgradeSlug: String(({ ...ethereumNetworkUpgrade.entitySelector, ...ethereumNetworkUpgrade }).slug),
							})
						}
						selection={select(EntityType.EthereumNetworkUpgrade, ethereumNetworkUpgrade.entitySelector)}
						prefetched={ethereumNetworkUpgrade}
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
		entityType={EntityType.EthereumNetworkUpgrade}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
