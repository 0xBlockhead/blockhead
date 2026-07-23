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
		title = 'Aptos state changes',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AptosStateChanges-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AptosStateChange>
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
	entityType={EntityType.AptosStateChange}
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
				changeKind: true,
				changeIndex: true,
				$transaction: {
					fields: {
						hash: true,
						transactionKind: true,
						version: true,
						sender: true,
					},
				},
			},
		})
	}
	{countResource}
	getResourceItems={(aptosStateChanges) => [...new Map(aptosStateChanges.values.map((aptosStateChange) => [aptosStateChange[EntityMetaKey.SelectorKey], aptosStateChange])).values()]}
	getKey={(aptosStateChange) => aptosStateChange[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Aptos state changes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aptosStateChange })}
		{@const aptosStateChangeFields = { ...aptosStateChange[EntityMetaKey.Selector], ...aptosStateChange }}
		<EntityView
			entityType={EntityType.AptosStateChange}
			entitySelector={aptosStateChange[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((aptosStateChangeFields.changeKind) ?? '')].filter(Boolean).join(' ') || 'aptos state change'}
			{/snippet}

			{#snippet Value()}
				{[String((aptosStateChangeFields.changeIndex) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((aptosStateChangeFields.$transaction.hash) ?? '')].filter(Boolean).join(' ') || [String((aptosStateChangeFields.$transaction.version) ?? '')].filter(Boolean).join(' ') || 'aptos transaction'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
