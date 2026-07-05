<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		title = 'Blockhead action readiness checks',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadActionReadinessChecks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadActionReadinessCheck>
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
	import BlockheadActionReadinessCheckView from '$/views/BlockheadActionReadinessCheckView.svelte'
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
					checkKind: true,
					capabilityKey: true,
					createdAt: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadActionReadinessChecks)}
			{@const uniqueBlockheadActionReadinessChecks = [...new Map(blockheadActionReadinessChecks.values.map((blockheadActionReadinessCheck) => [blockheadActionReadinessCheck[EntityMetaKey.SelectorKey], blockheadActionReadinessCheck])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadActionReadinessCheck}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadActionReadinessChecks.totalCount}
				getKey={(blockheadActionReadinessCheck) => blockheadActionReadinessCheck[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadActionReadinessChecks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead action readiness checks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadActionReadinessCheck }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadActionReadinessCheck> })}
					{@const blockheadActionReadinessCheckFields = { ...blockheadActionReadinessCheck[EntityMetaKey.Selector], ...blockheadActionReadinessCheck }}
					<BlockheadActionReadinessCheckView
						selection={select(EntityType.BlockheadActionReadinessCheck, blockheadActionReadinessCheck[EntityMetaKey.Selector])}
						prefetched={blockheadActionReadinessCheckFields}
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
		entityType={EntityType.BlockheadActionReadinessCheck}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
