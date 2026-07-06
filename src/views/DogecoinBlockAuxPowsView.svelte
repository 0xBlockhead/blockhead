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
		title = 'Dogecoin block aux pows',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DogecoinBlockAuxPows-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.DogecoinBlockAuxPow>
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
	import DogecoinBlockAuxPowView from '$/views/DogecoinBlockAuxPowView.svelte'
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
					$block: true,
					$parentBlockHeader: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.DogecoinBlockAuxPow}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(dogecoinBlockAuxPows)}
			{@const uniqueDogecoinBlockAuxPows = [...new Map(dogecoinBlockAuxPows.values.map((dogecoinBlockAuxPow) => [dogecoinBlockAuxPow[EntityMetaKey.SelectorKey], dogecoinBlockAuxPow])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.DogecoinBlockAuxPow}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={dogecoinBlockAuxPows.totalCount}
				getKey={(dogecoinBlockAuxPow) => dogecoinBlockAuxPow[EntityMetaKey.SelectorKey]}
				items={uniqueDogecoinBlockAuxPows}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Dogecoin block aux pows yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: dogecoinBlockAuxPow }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.DogecoinBlockAuxPow> })}
					{@const dogecoinBlockAuxPowFields = { ...dogecoinBlockAuxPow[EntityMetaKey.Selector], ...dogecoinBlockAuxPow }}
					<DogecoinBlockAuxPowView
						selection={select(EntityType.DogecoinBlockAuxPow, dogecoinBlockAuxPow[EntityMetaKey.Selector])}
						prefetched={dogecoinBlockAuxPowFields}
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
		entityType={EntityType.DogecoinBlockAuxPow}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
