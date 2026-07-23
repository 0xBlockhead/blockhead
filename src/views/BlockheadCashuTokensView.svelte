<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'Blockhead Cashu tokens',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCashuTokens-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadCashuToken>
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
	entityType={EntityType.BlockheadCashuToken}
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
				id: true,
				status: true,
				totalAmount: true,
				unit: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadCashuTokens) => [...new Map(blockheadCashuTokens.values.map((blockheadCashuToken) => [blockheadCashuToken[EntityMetaKey.SelectorKey], blockheadCashuToken])).values()]}
	getKey={(blockheadCashuToken) => blockheadCashuToken[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Cashu tokens yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCashuToken })}
		{@const blockheadCashuTokenFields = { ...blockheadCashuToken[EntityMetaKey.Selector], ...blockheadCashuToken }}
		<EntityView
			entityType={EntityType.BlockheadCashuToken}
			entitySelector={blockheadCashuToken[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadCashuTokenFields.id) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu token'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadCashuTokenFields.status) ?? ''), (String((blockheadCashuTokenFields.totalAmount) ?? '') ? String((blockheadCashuTokenFields.totalAmount) ?? '') + blockheadCashuTokenFields.unit : '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
