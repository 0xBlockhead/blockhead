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
		title = 'IPFS resources',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'IpfsResources-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.IpfsResource>
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
	entityType={EntityType.IpfsResource}
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
				canonicalUri: true,
				contentType: true,
				displayType: true,
				contentPath: true,
				namespace: true,
				target: true,
			},
		})
	}
	{countResource}
	getResourceItems={(ipfsResources) => [...new Map(ipfsResources.values.map((ipfsResource) => [ipfsResource[EntityMetaKey.SelectorKey], ipfsResource])).values()]}
	getKey={(ipfsResource) => ipfsResource[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No IPFS resources yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ipfsResource })}
		{@const ipfsResourceFields = { ...ipfsResource[EntityMetaKey.Selector], ...ipfsResource }}
		<EntityView
			entityType={EntityType.IpfsResource}
			entitySelector={ipfsResource[EntityMetaKey.Selector]}
			href={
				(
					ipfsResource[EntityMetaKey.Selector] != null && 'namespace' in ipfsResource[EntityMetaKey.Selector]
					&& ipfsResource[EntityMetaKey.Selector].namespace != null
					&& ipfsResource[EntityMetaKey.Selector] != null && 'target' in ipfsResource[EntityMetaKey.Selector]
					&& ipfsResource[EntityMetaKey.Selector].target != null ?
						ipfsResource[EntityMetaKey.Selector].target != null ?
							resolve('/[namespace=ipfsNamespace]/[target=stringSegment]', {
						namespace: String(ipfsResource[EntityMetaKey.Selector].namespace ?? ''),
						target: String(ipfsResource[EntityMetaKey.Selector].target ?? ''),
					})
					:
							ipfsResource[EntityMetaKey.Selector].target != null
							&& ipfsResource[EntityMetaKey.Selector] != null && 'contentPath' in ipfsResource[EntityMetaKey.Selector]
							&& ipfsResource[EntityMetaKey.Selector].contentPath != null ?
								resolve('/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]', {
							namespace: String(ipfsResource[EntityMetaKey.Selector].namespace ?? ''),
							target: String(ipfsResource[EntityMetaKey.Selector].target ?? ''),
							contentPath: String(ipfsResource[EntityMetaKey.Selector].contentPath ?? ''),
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
				{[String((ipfsResourceFields.canonicalUri) ?? '')].filter(Boolean).join(' ') || 'IPFS resource'}
			{/snippet}

			{#snippet Value()}
				{[String((ipfsResourceFields.contentType) ?? ''), String((ipfsResourceFields.displayType) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
