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
		placeholderText,
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
				totalCount={ethereumExecutionUpgrades.totalCount}
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
					{@const ethereumExecutionUpgradeFields = { ...ethereumExecutionUpgrade[EntityMetaKey.Selector], ...ethereumExecutionUpgrade }}
					{@const ethereumExecutionUpgradeHrefFields = { ...ethereumExecutionUpgrade, ...ethereumExecutionUpgrade[EntityMetaKey.Selector] }}
					<EthereumExecutionUpgradeView
						selection={select(EntityType.EthereumExecutionUpgrade, ethereumExecutionUpgrade[EntityMetaKey.Selector])}
						prefetched={ethereumExecutionUpgradeFields}
						href={
							(ethereumExecutionUpgradeHrefFields.$network !== undefined && ethereumExecutionUpgradeHrefFields.$network.caip2 !== undefined && ethereumExecutionUpgradeHrefFields.$network.caip2.namespace !== undefined && ethereumExecutionUpgradeHrefFields.$network !== undefined && ethereumExecutionUpgradeHrefFields.$network.caip2 !== undefined && ethereumExecutionUpgradeHrefFields.$network.caip2.reference !== undefined && ethereumExecutionUpgradeHrefFields.slug !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/execution/[upgradeSlug]', {
								caip2: `${String(ethereumExecutionUpgradeHrefFields.$network.caip2.namespace ?? '')}:${String(ethereumExecutionUpgradeHrefFields.$network.caip2.reference ?? '')}`,
								upgradeSlug: String(ethereumExecutionUpgradeHrefFields.slug ?? ''),
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
		entityType={EntityType.EthereumExecutionUpgrade}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
