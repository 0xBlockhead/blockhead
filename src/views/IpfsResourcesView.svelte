<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'IPFS resources',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading IPFS resources...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'IpfsResources-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.IpfsResource>
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
			selection.sources == null ? selection({
				fields: {
					canonicalUri: true,
					contentType: true,
					displayType: true,
				},
			}) : selection
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
				totalCount={ipfsResources.values.length === uniqueIpfsResources.length && ipfsResources.totalCount != null && ipfsResources.totalCount >= uniqueIpfsResources.length ? ipfsResources.totalCount : uniqueIpfsResources.length}
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

				{#snippet Item({ item: ipfsResource }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.IpfsResource> })}
					<IpfsResourceView
						href={
							(({ ...ipfsResource.entitySelector, ...ipfsResource })?.namespace != null && ({ ...ipfsResource.entitySelector, ...ipfsResource })?.target != null && ({ ...ipfsResource.entitySelector, ...ipfsResource })?.contentPath != null ? resolve('/(explore)/(ipfs)/ipfs/[namespace]/[target]', {
								namespace: String(({ ...ipfsResource.entitySelector, ...ipfsResource }).namespace),
								target: String(({ ...ipfsResource.entitySelector, ...ipfsResource }).target),
							}) : ({ ...ipfsResource.entitySelector, ...ipfsResource })?.namespace != null && ({ ...ipfsResource.entitySelector, ...ipfsResource })?.target != null && ({ ...ipfsResource.entitySelector, ...ipfsResource })?.contentPath != null ? resolve('/(explore)/(ipfs)/ipfs/[namespace]/[target]/(ipfsResource)/path/[...contentPath]', {
								namespace: String(({ ...ipfsResource.entitySelector, ...ipfsResource }).namespace),
								target: String(({ ...ipfsResource.entitySelector, ...ipfsResource }).target),
								contentPath: String(({ ...ipfsResource.entitySelector, ...ipfsResource }).contentPath),
							}) : undefined)
						}
						selection={select(EntityType.IpfsResource, ipfsResource.entitySelector)}
						prefetched={ipfsResource}
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
