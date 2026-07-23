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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LightningNode>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.LightningNode}
			entitySelector={lightningNode[EntityMetaKey.Selector]}
			href={
				(
					lightningNode[EntityMetaKey.Selector] != null && 'publicKey' in lightningNode[EntityMetaKey.Selector]
					&& lightningNode[EntityMetaKey.Selector].publicKey != null
					&& lightningNode[EntityMetaKey.Selector] != null && '$network' in lightningNode[EntityMetaKey.Selector] ?
						lightningNode[EntityMetaKey.Selector].$network != null && 'caip2' in lightningNode[EntityMetaKey.Selector].$network
						&& lightningNode[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
						pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
						network: String(caip2StringFromValue(lightningNode[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							lightningNode[EntityMetaKey.Selector].$network != null && 'slug' in lightningNode[EntityMetaKey.Selector].$network
							&& lightningNode[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
							pubkey: String(lightningNode[EntityMetaKey.Selector].publicKey ?? ''),
							network: String(lightningNode[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((lightningNodeFields.publicKey) ?? '')].filter(Boolean).join(' ') || 'Lightning node'}
			{/snippet}

			{#snippet Value()}
				{[[String((lightningNodeFields.$network.name) ?? '')].filter(Boolean).join(' ') || [lightningNodeFields.$network.caip2 == null ? '' : String(`${(lightningNodeFields.$network.caip2).namespace}:${(lightningNodeFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
