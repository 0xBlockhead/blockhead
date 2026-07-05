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
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Pallets',
		typeAnnotationParagraphs = [],
		placeholderText,
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
			selection({
				fields: {
					palletName: true,
					index: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
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
				totalCount={polkadotPallets.totalCount}
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
					{@const polkadotPalletFields = { ...polkadotPallet[EntityMetaKey.Selector], ...polkadotPallet }}
					{@const polkadotPalletHrefFields = { ...polkadotPallet, ...polkadotPallet[EntityMetaKey.Selector] }}
					<PolkadotPalletView
						selection={select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector])}
						prefetched={polkadotPalletFields}
						href={
							(polkadotPalletHrefFields.$network !== undefined && polkadotPalletHrefFields.$network.caip2 !== undefined && polkadotPalletHrefFields.$network.caip2.namespace !== undefined && polkadotPalletHrefFields.$network !== undefined && polkadotPalletHrefFields.$network.caip2 !== undefined && polkadotPalletHrefFields.$network.caip2.reference !== undefined && polkadotPalletHrefFields.palletName !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
								networkSlug: String(networkByCaip2[String(String(polkadotPalletHrefFields.$network.caip2.namespace) + ':' + String(polkadotPalletHrefFields.$network.caip2.reference))].slug ?? ''),
								palletName: String(polkadotPalletHrefFields.palletName ?? ''),
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
		entityType={EntityType.PolkadotPallet}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
