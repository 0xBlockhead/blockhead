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
		title = 'Blockhead action readiness checks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadActionReadinessChecks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadActionReadinessCheck>
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
	entityType={EntityType.BlockheadActionReadinessCheck}
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
				checkKind: true,
				capabilityKey: true,
				createdAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadActionReadinessChecks) => [...new Map(blockheadActionReadinessChecks.values.map((blockheadActionReadinessCheck) => [blockheadActionReadinessCheck[EntityMetaKey.SelectorKey], blockheadActionReadinessCheck])).values()]}
	getKey={(blockheadActionReadinessCheck) => blockheadActionReadinessCheck[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead action readiness checks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadActionReadinessCheck })}
		{@const blockheadActionReadinessCheckFields = { ...blockheadActionReadinessCheck[EntityMetaKey.Selector], ...blockheadActionReadinessCheck }}
		<EntityView
			entityType={EntityType.BlockheadActionReadinessCheck}
			entitySelector={blockheadActionReadinessCheck[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadActionReadinessCheckFields.checkKind) ?? '')].filter(Boolean).join(' ') || 'blockhead action readiness check'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadActionReadinessCheckFields.capabilityKey) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadActionReadinessCheckFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
