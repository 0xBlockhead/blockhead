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
		title = 'Pallets',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotPallets-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.PolkadotPallet>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotPallet}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				palletName: true,
				index: true,
				$network: true,
			},
		})
	}
	getResourceItems={(polkadotPallets) => [...new Map(polkadotPallets.values.map((polkadotPallet) => [polkadotPallet[EntityMetaKey.SelectorKey], polkadotPallet])).values()]}
	getKey={(polkadotPallet) => polkadotPallet[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Polkadot pallets yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: polkadotPallet })}
		{@const polkadotPalletFields = { ...polkadotPallet[EntityMetaKey.Selector], ...polkadotPallet }}
		{@const selection = select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const polkadotPalletHrefFields = { ...polkadotPallet, ...polkadotPallet[EntityMetaKey.Selector] }}
		<PolkadotPalletView
			selection={selection}
			prefetched={polkadotPalletFields}
			href={
				(polkadotPalletHrefFields.palletName !== undefined && polkadotPalletHrefFields.$network !== undefined && polkadotPalletHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
					palletName: String(polkadotPalletHrefFields.palletName ?? ''),
					network: String(caip2StringFromValue(polkadotPalletHrefFields.$network.caip2) ?? ''),
				}) : polkadotPalletHrefFields.palletName !== undefined && polkadotPalletHrefFields.$network !== undefined && polkadotPalletHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
					palletName: String(polkadotPalletHrefFields.palletName ?? ''),
					network: String(polkadotPalletHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
