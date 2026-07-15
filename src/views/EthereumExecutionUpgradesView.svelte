<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Ethereum execution upgrades',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EthereumExecutionUpgrades-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EthereumExecutionUpgrade>
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

	const collectionSelection = $derived(selection)


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
					slug: true,
					$network: true,
				},
			})
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
				placeholderText={placeholderText}
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

				{#snippet Item({ item: ethereumExecutionUpgrade })}
					{@const ethereumExecutionUpgradeFields = { ...ethereumExecutionUpgrade[EntityMetaKey.Selector], ...ethereumExecutionUpgrade }}
					{@const selection = select(EntityType.EthereumExecutionUpgrade, ethereumExecutionUpgrade[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const ethereumExecutionUpgradeHrefFields = { ...ethereumExecutionUpgrade, ...ethereumExecutionUpgrade[EntityMetaKey.Selector] }}
					<EthereumExecutionUpgradeView
						selection={selection}
						prefetched={ethereumExecutionUpgradeFields}
						href={
							(ethereumExecutionUpgradeHrefFields.slug !== undefined && ethereumExecutionUpgradeHrefFields.$network !== undefined && ethereumExecutionUpgradeHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/execution/[upgradeSlug=stringSegment]', {
								upgradeSlug: String(ethereumExecutionUpgradeHrefFields.slug ?? ''),
								network: String(caip2StringFromValue(ethereumExecutionUpgradeHrefFields.$network.caip2) ?? ''),
							}) : ethereumExecutionUpgradeHrefFields.slug !== undefined && ethereumExecutionUpgradeHrefFields.$network !== undefined && ethereumExecutionUpgradeHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/execution/[upgradeSlug=stringSegment]', {
								upgradeSlug: String(ethereumExecutionUpgradeHrefFields.slug ?? ''),
								network: String(ethereumExecutionUpgradeHrefFields.$network.slug ?? ''),
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
