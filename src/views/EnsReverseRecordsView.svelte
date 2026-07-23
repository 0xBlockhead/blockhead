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
		title = 'ENS reverse records',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EnsReverseRecords-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EnsReverseRecord>
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
	entityType={EntityType.EnsReverseRecord}
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
				$name: true,
				$account: true,
			},
		})
	}
	{countResource}
	getResourceItems={(ensReverseRecords) => [...new Map(ensReverseRecords.values.map((ensReverseRecord) => [ensReverseRecord[EntityMetaKey.SelectorKey], ensReverseRecord])).values()]}
	getKey={(ensReverseRecord) => ensReverseRecord[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ENS reverse records yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ensReverseRecord })}
		{@const ensReverseRecordFields = { ...ensReverseRecord[EntityMetaKey.Selector], ...ensReverseRecord }}
		<EntityView
			entityType={EntityType.EnsReverseRecord}
			entitySelector={ensReverseRecord[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((ensReverseRecordFields.$name.name) ?? '')].filter(Boolean).join(' ') || 'ENS name'].filter(Boolean).join(' ') || 'ENS reverse record'}
			{/snippet}

			{#snippet Value()}
				{[[ensReverseRecordFields.$account.caip10 == null ? '' : String(`${(ensReverseRecordFields.$account.caip10).namespace}:${(ensReverseRecordFields.$account.caip10).reference}:${(ensReverseRecordFields.$account.caip10).accountAddress}`)].filter(Boolean).join(' ') || 'account'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
