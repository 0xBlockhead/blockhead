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
		title = 'Extrinsics',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotExtrinsics-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.PolkadotExtrinsic>
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
	entityType={EntityType.PolkadotExtrinsic}
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
				indexInBlock: true,
				callName: true,
				success: true,
				$block: true,
			},
		})
	}
	{countResource}
	getResourceItems={(polkadotExtrinsics) => [...new Map(polkadotExtrinsics.values.map((polkadotExtrinsic) => [polkadotExtrinsic[EntityMetaKey.SelectorKey], polkadotExtrinsic])).values()]}
	getKey={(polkadotExtrinsic) => polkadotExtrinsic[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Polkadot extrinsics yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: polkadotExtrinsic })}
		{@const polkadotExtrinsicFields = { ...polkadotExtrinsic[EntityMetaKey.Selector], ...polkadotExtrinsic }}
		<EntityView
			entityType={EntityType.PolkadotExtrinsic}
			entitySelector={polkadotExtrinsic[EntityMetaKey.Selector]}
			href={
				(
					polkadotExtrinsic[EntityMetaKey.Selector] != null && 'indexInBlock' in polkadotExtrinsic[EntityMetaKey.Selector]
					&& polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock != null
					&& polkadotExtrinsic[EntityMetaKey.Selector] != null && '$block' in polkadotExtrinsic[EntityMetaKey.Selector]
					&& polkadotExtrinsic[EntityMetaKey.Selector].$block != null && 'blockNumber' in polkadotExtrinsic[EntityMetaKey.Selector].$block
					&& polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber != null
					&& polkadotExtrinsic[EntityMetaKey.Selector].$block != null && 'hash' in polkadotExtrinsic[EntityMetaKey.Selector].$block
					&& polkadotExtrinsic[EntityMetaKey.Selector].$block.hash != null
					&& polkadotExtrinsic[EntityMetaKey.Selector].$block != null && '$network' in polkadotExtrinsic[EntityMetaKey.Selector].$block ?
						polkadotExtrinsic[EntityMetaKey.Selector].$block.$network != null && 'caip2' in polkadotExtrinsic[EntityMetaKey.Selector].$block.$network
						&& polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
						extrinsicIndex: String(polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock ?? ''),
						blockNumber: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber ?? ''),
						hash: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.hash ?? ''),
						network: String(caip2StringFromValue(polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.caip2) ?? ''),
					})
					:
							polkadotExtrinsic[EntityMetaKey.Selector].$block.$network != null && 'slug' in polkadotExtrinsic[EntityMetaKey.Selector].$block.$network
							&& polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
							extrinsicIndex: String(polkadotExtrinsic[EntityMetaKey.Selector].indexInBlock ?? ''),
							blockNumber: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.blockNumber ?? ''),
							hash: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.hash ?? ''),
							network: String(polkadotExtrinsic[EntityMetaKey.Selector].$block.$network.slug ?? ''),
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
				{(String((polkadotExtrinsicFields.indexInBlock) ?? '') ? 'Extrinsic #' + String((polkadotExtrinsicFields.indexInBlock) ?? '') : '') || 'Polkadot extrinsic'}
			{/snippet}

			{#snippet Value()}
				{[String((polkadotExtrinsicFields.callName) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((polkadotExtrinsicFields.success) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
