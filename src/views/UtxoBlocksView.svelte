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
		title = 'UTXO blocks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.UtxoBlock>
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
	entityType={EntityType.UtxoBlock}
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
				height: true,
				hash: true,
				transactionCount: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(utxoBlocks) => [...new Map(utxoBlocks.values.map((utxoBlock) => [utxoBlock[EntityMetaKey.SelectorKey], utxoBlock])).values()]}
	getKey={(utxoBlock) => utxoBlock[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No UTXO blocks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: utxoBlock })}
		{@const utxoBlockFields = { ...utxoBlock[EntityMetaKey.Selector], ...utxoBlock }}
		<EntityView
			entityType={EntityType.UtxoBlock}
			entitySelector={utxoBlock[EntityMetaKey.Selector]}
			href={
				(
					utxoBlock[EntityMetaKey.Selector] != null && 'height' in utxoBlock[EntityMetaKey.Selector]
					&& utxoBlock[EntityMetaKey.Selector].height != null
					&& utxoBlock[EntityMetaKey.Selector] != null && 'hash' in utxoBlock[EntityMetaKey.Selector]
					&& utxoBlock[EntityMetaKey.Selector].hash != null
					&& utxoBlock[EntityMetaKey.Selector] != null && '$network' in utxoBlock[EntityMetaKey.Selector] ?
						utxoBlock[EntityMetaKey.Selector].$network != null && 'caip2' in utxoBlock[EntityMetaKey.Selector].$network
						&& utxoBlock[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
						blockNumber: String(utxoBlock[EntityMetaKey.Selector].height ?? ''),
						hash: String(utxoBlock[EntityMetaKey.Selector].hash ?? ''),
						network: String(caip2StringFromValue(utxoBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							utxoBlock[EntityMetaKey.Selector].$network != null && 'slug' in utxoBlock[EntityMetaKey.Selector].$network
							&& utxoBlock[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
							blockNumber: String(utxoBlock[EntityMetaKey.Selector].height ?? ''),
							hash: String(utxoBlock[EntityMetaKey.Selector].hash ?? ''),
							network: String(utxoBlock[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{(String((utxoBlockFields.height) ?? '') ? 'Block #' + String((utxoBlockFields.height) ?? '') : '') || [String((utxoBlockFields.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((utxoBlockFields.transactionCount) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
