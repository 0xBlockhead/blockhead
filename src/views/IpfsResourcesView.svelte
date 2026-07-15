<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.IpfsResource>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import IpfsResourceView from '$/views/IpfsResourceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
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
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.IpfsResource}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(ipfsResources)}
			{@const uniqueIpfsResources = [...new Map(ipfsResources.values.map((ipfsResource) => [ipfsResource[EntityMetaKey.SelectorKey], ipfsResource])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.IpfsResource}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={ipfsResources.totalCount}
				getKey={(ipfsResource) => ipfsResource[EntityMetaKey.SelectorKey]}
				items={uniqueIpfsResources}
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
					{@const selection = select(EntityType.IpfsResource, ipfsResource[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const ipfsResourceHrefFields = { ...ipfsResource, ...ipfsResource[EntityMetaKey.Selector] }}
					<IpfsResourceView
						selection={selection}
						prefetched={ipfsResourceFields}
						href={
							(ipfsResource[EntityMetaKey.Selector].contentPath === '' && ipfsResourceHrefFields.namespace !== undefined && ipfsResourceHrefFields.target !== undefined ? resolve('/[namespace=ipfsNamespace]/[target=stringSegment]', {
								namespace: String(ipfsResourceHrefFields.namespace ?? ''),
								target: String(ipfsResourceHrefFields.target ?? ''),
							}) : ipfsResource[EntityMetaKey.Selector].contentPath !== '' && ipfsResourceHrefFields.namespace !== undefined && ipfsResourceHrefFields.target !== undefined && ipfsResourceHrefFields.contentPath !== undefined ? resolve('/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]', {
								namespace: String(ipfsResourceHrefFields.namespace ?? ''),
								target: String(ipfsResourceHrefFields.target ?? ''),
								contentPath: String(ipfsResourceHrefFields.contentPath ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.IpfsResource}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
