<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.PolkadotPallet>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.PolkadotPallet}
			entitySelector={polkadotPallet[EntityMetaKey.Selector]}
			href={
				(
					polkadotPallet[EntityMetaKey.Selector] != null && 'palletName' in polkadotPallet[EntityMetaKey.Selector]
					&& polkadotPallet[EntityMetaKey.Selector].palletName != null
					&& polkadotPallet[EntityMetaKey.Selector] != null && '$network' in polkadotPallet[EntityMetaKey.Selector] ?
						polkadotPallet[EntityMetaKey.Selector].$network != null && 'caip2' in polkadotPallet[EntityMetaKey.Selector].$network
						&& polkadotPallet[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
						palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
						network: String(caip2StringFromValue(polkadotPallet[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							polkadotPallet[EntityMetaKey.Selector].$network != null && 'slug' in polkadotPallet[EntityMetaKey.Selector].$network
							&& polkadotPallet[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
							palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
							network: String(polkadotPallet[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((polkadotPalletFields.palletName) ?? '')].filter(Boolean).join(' ') || 'Polkadot pallet'}
			{/snippet}

			{#snippet Value()}
				{[String((polkadotPalletFields.palletName) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((polkadotPalletFields.index) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
