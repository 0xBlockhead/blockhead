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
		title = 'Lightning nodes',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LightningNodes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LightningNode>
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
	import LightningNodeView from '$/views/LightningNodeView.svelte'
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
					alias: true,
					channelCount: true,
					publicKey: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LightningNode}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(lightningNodes)}
			{@const uniqueLightningNodes = [...new Map(lightningNodes.values.map((lightningNode) => [lightningNode[EntityMetaKey.SelectorKey], lightningNode])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LightningNode}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={lightningNodes.totalCount}
				getKey={(lightningNode) => lightningNode[EntityMetaKey.SelectorKey]}
				items={uniqueLightningNodes}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Lightning nodes yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: lightningNode }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LightningNode> })}
					{@const lightningNodeFields = { ...lightningNode[EntityMetaKey.Selector], ...lightningNode }}
					{@const lightningNodeHrefFields = { ...lightningNode, ...lightningNode[EntityMetaKey.Selector] }}
					<LightningNodeView
						selection={select(EntityType.LightningNode, lightningNode[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={lightningNodeFields}
						href={
							(lightningNodeHrefFields.$network !== undefined && lightningNodeHrefFields.$network.slug !== undefined && lightningNodeHrefFields.publicKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
								network: String(lightningNodeHrefFields.$network.slug ?? ''),
								pubkey: String(lightningNodeHrefFields.publicKey ?? ''),
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
		entityType={EntityType.LightningNode}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
