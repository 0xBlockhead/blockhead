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
		title = 'Pallets',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Polkadot pallets...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotPallets-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.PolkadotPallet>
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
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
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
					palletName: true,
					index: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotPallet}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(polkadotPallets)}
			{@const uniquePolkadotPallets = [...new Map(polkadotPallets.values.map((polkadotPallet) => [polkadotPallet[EntityMetaKey.SelectorKey], polkadotPallet])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotPallet}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={polkadotPallets.values.length === uniquePolkadotPallets.length && polkadotPallets.totalCount != null && polkadotPallets.totalCount >= uniquePolkadotPallets.length ? polkadotPallets.totalCount : uniquePolkadotPallets.length}
				getKey={(polkadotPallet) => polkadotPallet[EntityMetaKey.SelectorKey]}
				items={uniquePolkadotPallets}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Polkadot pallets yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: polkadotPallet }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.PolkadotPallet> })}
					<PolkadotPalletView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
								networkSlug: String(({ ...polkadotPallet.entitySelector, ...polkadotPallet }).$network.slug),
								palletName: String(({ ...polkadotPallet.entitySelector, ...polkadotPallet }).palletName),
							})
						}
						selection={select(EntityType.PolkadotPallet, polkadotPallet.entitySelector)}
						prefetched={polkadotPallet}
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
		entityType={EntityType.PolkadotPallet}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
