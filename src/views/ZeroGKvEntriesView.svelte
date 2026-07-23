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
		title = 'Zero g kv entries',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGKvEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZeroGKvEntry>
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
	entityType={EntityType.ZeroGKvEntry}
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
				key: true,
				namespace: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zeroGKvEntries) => [...new Map(zeroGKvEntries.values.map((zeroGKvEntry) => [zeroGKvEntry[EntityMetaKey.SelectorKey], zeroGKvEntry])).values()]}
	getKey={(zeroGKvEntry) => zeroGKvEntry[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zero g kv entries yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zeroGKvEntry })}
		{@const zeroGKvEntryFields = { ...zeroGKvEntry[EntityMetaKey.Selector], ...zeroGKvEntry }}
		<EntityView
			entityType={EntityType.ZeroGKvEntry}
			entitySelector={zeroGKvEntry[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((zeroGKvEntryFields.key) ?? '')].filter(Boolean).join(' ') || 'zero g kv entry'}
			{/snippet}

			{#snippet Value()}
				{[String((zeroGKvEntryFields.namespace) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((zeroGKvEntryFields.$network.name) ?? '')].filter(Boolean).join(' ') || [zeroGKvEntryFields.$network.caip2 == null ? '' : String(`${(zeroGKvEntryFields.$network.caip2).namespace}:${(zeroGKvEntryFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
