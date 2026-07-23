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
		title = 'AT Protocol',
		typeAnnotationParagraphs = ['AT Protocol is a DID-based social protocol. This hub shows bounded actor and post windows from declared Bluesky-compatible appview sources, not a claim about every repository on the network.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalAtprotoNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType._GlobalAtprotoNetwork>
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
	entityType={EntityType._GlobalAtprotoNetwork}
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
				protocolName: true,
				scope: true,
			},
		})
	}
	{countResource}
	getResourceItems={(globalAtprotoNetworks) => [...new Map(globalAtprotoNetworks.values.map((globalAtprotoNetwork) => [globalAtprotoNetwork[EntityMetaKey.SelectorKey], globalAtprotoNetwork])).values()]}
	getKey={(globalAtprotoNetwork) => globalAtprotoNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AT Protocol yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalAtprotoNetwork })}
		{@const globalAtprotoNetworkFields = { ...globalAtprotoNetwork[EntityMetaKey.Selector], ...globalAtprotoNetwork }}
		<EntityView
			entityType={EntityType._GlobalAtprotoNetwork}
			entitySelector={globalAtprotoNetwork[EntityMetaKey.Selector]}
			href={
				(
					globalAtprotoNetwork[EntityMetaKey.Selector].scope === '_GlobalAtprotoNetwork' ?
						resolve('/atproto')
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((globalAtprotoNetworkFields.protocolName) ?? '')].filter(Boolean).join(' ') || [String('AT Protocol')].filter(Boolean).join(' ') || 'AT Protocol'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
