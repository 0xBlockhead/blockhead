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




	// State
	let {
		selection,
		countResource,
		title = 'Lightning networks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LightningNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LightningNetwork>
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
	entityType={EntityType.LightningNetwork}
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
				name: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(lightningNetworks) => [...new Map(lightningNetworks.values.map((lightningNetwork) => [lightningNetwork[EntityMetaKey.SelectorKey], lightningNetwork])).values()]}
	getKey={(lightningNetwork) => lightningNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lightning networks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: lightningNetwork })}
		{@const lightningNetworkFields = { ...lightningNetwork[EntityMetaKey.Selector], ...lightningNetwork }}
		{@const lightningNetworkHrefFields = { ...lightningNetwork, ...lightningNetwork[EntityMetaKey.Selector] }}
		<EntityView
			entityType={EntityType.LightningNetwork}
			entitySelector={lightningNetwork[EntityMetaKey.Selector]}
			href={
				resolve('/network/[network]', {
					network: String(lightningNetworkHrefFields.$network.slug ?? ''),
				})
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((lightningNetworkFields.name) ?? '')].filter(Boolean).join(' ') || [[String((lightningNetworkFields.$network.name) ?? '')].filter(Boolean).join(' ') || [lightningNetworkFields.$network.caip2 == null ? '' : String(`${(lightningNetworkFields.$network.caip2).namespace}:${(lightningNetworkFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ') || 'Lightning network'}
			{/snippet}

			{#snippet Value()}
				{['Lightning'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
