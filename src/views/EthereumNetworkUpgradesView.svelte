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
		placeholderText,
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
			selection({
				fields: {
					upgradeId: true,
					name: true,
					$network: true,
					slug: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={ethereumNetworkUpgrades.totalCount}
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
					{@const ethereumNetworkUpgradeFields = { ...ethereumNetworkUpgrade[EntityMetaKey.Selector], ...ethereumNetworkUpgrade }}
					{@const ethereumNetworkUpgradeHrefFields = { ...ethereumNetworkUpgrade, ...ethereumNetworkUpgrade[EntityMetaKey.Selector] }}
					<EthereumNetworkUpgradeView
						selection={select(EntityType.EthereumNetworkUpgrade, ethereumNetworkUpgrade[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={ethereumNetworkUpgradeFields}
						href={
							(ethereumNetworkUpgradeHrefFields.$network !== undefined && ethereumNetworkUpgradeHrefFields.$network.caip2 !== undefined && ethereumNetworkUpgradeHrefFields.$network.caip2.namespace !== undefined && ethereumNetworkUpgradeHrefFields.$network !== undefined && ethereumNetworkUpgradeHrefFields.$network.caip2 !== undefined && ethereumNetworkUpgradeHrefFields.$network.caip2.reference !== undefined && ethereumNetworkUpgradeHrefFields.slug !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
								caip2: `${String(ethereumNetworkUpgradeHrefFields.$network.caip2.namespace ?? '')}:${String(ethereumNetworkUpgradeHrefFields.$network.caip2.reference ?? '')}`,
								upgradeSlug: String(ethereumNetworkUpgradeHrefFields.slug ?? ''),
							}) : undefined)
						}
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
