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
		title = 'Networks',
		typeAnnotationParagraphs = ['A blockchain, ledger, or protocol network with its own identity and supporting metadata.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Networks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Network>
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
	entityType={EntityType.Network}
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
				$icon: true,
				name: true,
				caip2: true,
				slug: true,
			},
		})
	}
	{countResource}
	getResourceItems={(networks) => [...new Map(networks.values.map((network) => [network[EntityMetaKey.SelectorKey], network])).values()]}
	getKey={(network) => network[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Networks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: network })}
		{@const networkFields = { ...network[EntityMetaKey.Selector], ...network }}
		<EntityView
			entityType={EntityType.Network}
			entitySelector={network[EntityMetaKey.Selector]}
			href={
				(
					network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
					&& network[EntityMetaKey.Selector].caip2 != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]', {
					network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
				})
				:
						network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
						&& network[EntityMetaKey.Selector].slug != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]', {
						network: String(network[EntityMetaKey.Selector].slug ?? ''),
					})
					:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((networkFields.name) ?? '')].filter(Boolean).join(' ') || [networkFields.caip2 == null ? '' : String(`${(networkFields.caip2).namespace}:${(networkFields.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'}
			{/snippet}

			{#snippet Value()}
				{[networkFields.caip2 == null ? '' : String(`${(networkFields.caip2).namespace}:${(networkFields.caip2).reference}`)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
