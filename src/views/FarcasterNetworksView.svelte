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
		title = 'Farcaster',
		typeAnnotationParagraphs = ['Farcaster profiles, channels, and casts: FID plus cast-hash identity with hub feeds from declared Farcaster sources.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FarcasterNetwork>
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
	entityType={EntityType.FarcasterNetwork}
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
	getResourceItems={(farcasterNetworks) => [...new Map(farcasterNetworks.values.map((farcasterNetwork) => [farcasterNetwork[EntityMetaKey.SelectorKey], farcasterNetwork])).values()]}
	getKey={(farcasterNetwork) => farcasterNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Farcaster yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: farcasterNetwork })}
		{@const farcasterNetworkFields = { ...farcasterNetwork[EntityMetaKey.Selector], ...farcasterNetwork }}
		<EntityView
			entityType={EntityType.FarcasterNetwork}
			entitySelector={farcasterNetwork[EntityMetaKey.Selector]}
			href={
				(
					farcasterNetwork[EntityMetaKey.Selector].scope === 'FarcasterNetwork' ?
						resolve('/farcaster')
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((farcasterNetworkFields.protocolName) ?? '')].filter(Boolean).join(' ') || 'Farcaster'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
