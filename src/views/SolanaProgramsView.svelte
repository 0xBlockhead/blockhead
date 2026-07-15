<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Programs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaPrograms-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SolanaProgram>
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
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
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
					programId: true,
					name: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaProgram}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(solanaPrograms)}
			{@const uniqueSolanaPrograms = [...new Map(solanaPrograms.values.map((solanaProgram) => [solanaProgram[EntityMetaKey.SelectorKey], solanaProgram])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaProgram}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={solanaPrograms.totalCount}
				getKey={(solanaProgram) => solanaProgram[EntityMetaKey.SelectorKey]}
				items={uniqueSolanaPrograms}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Solana programs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: solanaProgram })}
					{@const solanaProgramFields = { ...solanaProgram[EntityMetaKey.Selector], ...solanaProgram }}
					{@const selection = select(EntityType.SolanaProgram, solanaProgram[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const solanaProgramHrefFields = { ...solanaProgram, ...solanaProgram[EntityMetaKey.Selector] }}
					<SolanaProgramView
						selection={selection}
						prefetched={solanaProgramFields}
						href={
							(solanaProgramHrefFields.programId !== undefined && solanaProgramHrefFields.$network !== undefined && solanaProgramHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/program/[programId=stringSegment]', {
								programId: String(solanaProgramHrefFields.programId ?? ''),
								network: String(caip2StringFromValue(solanaProgramHrefFields.$network.caip2) ?? ''),
							}) : solanaProgramHrefFields.programId !== undefined && solanaProgramHrefFields.$network !== undefined && solanaProgramHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/program/[programId=stringSegment]', {
								programId: String(solanaProgramHrefFields.programId ?? ''),
								network: String(solanaProgramHrefFields.$network.slug ?? ''),
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
		entityType={EntityType.SolanaProgram}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
