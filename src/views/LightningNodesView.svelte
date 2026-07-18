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
		title = 'Lightning nodes',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LightningNodes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.LightningNode>
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
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LightningNode}
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
				publicKey: true,
				$network: true,
			},
		})
	}
	getResourceItems={(lightningNodes) => [...new Map(lightningNodes.values.map((lightningNode) => [lightningNode[EntityMetaKey.SelectorKey], lightningNode])).values()]}
	getKey={(lightningNode) => lightningNode[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lightning nodes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: lightningNode })}
		{@const lightningNodeFields = { ...lightningNode[EntityMetaKey.Selector], ...lightningNode }}
		{@const selection = select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const lightningNodeHrefFields = { ...lightningNode, ...lightningNode[EntityMetaKey.Selector] }}
		<LightningNodeView
			selection={selection}
			prefetched={lightningNodeFields}
			href={
				(lightningNodeHrefFields.publicKey !== undefined && lightningNodeHrefFields.$network !== undefined && lightningNodeHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
					pubkey: String(lightningNodeHrefFields.publicKey ?? ''),
					network: String(caip2StringFromValue(lightningNodeHrefFields.$network.caip2) ?? ''),
				}) : lightningNodeHrefFields.publicKey !== undefined && lightningNodeHrefFields.$network !== undefined && lightningNodeHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
					pubkey: String(lightningNodeHrefFields.publicKey ?? ''),
					network: String(lightningNodeHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
