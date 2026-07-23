<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SolanaProgram>
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
	entityType={EntityType.SolanaProgram}
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
				programId: true,
				name: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(solanaPrograms) => [...new Map(solanaPrograms.values.map((solanaProgram) => [solanaProgram[EntityMetaKey.SelectorKey], solanaProgram])).values()]}
	getKey={(solanaProgram) => solanaProgram[EntityMetaKey.SelectorKey]}
	{placeholderText}
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
		<EntityView
			entityType={EntityType.SolanaProgram}
			entitySelector={solanaProgram[EntityMetaKey.Selector]}
			href={
				(
					solanaProgram[EntityMetaKey.Selector] != null && 'programId' in solanaProgram[EntityMetaKey.Selector]
					&& solanaProgram[EntityMetaKey.Selector].programId != null
					&& solanaProgram[EntityMetaKey.Selector] != null && '$network' in solanaProgram[EntityMetaKey.Selector] ?
						solanaProgram[EntityMetaKey.Selector].$network != null && 'caip2' in solanaProgram[EntityMetaKey.Selector].$network
						&& solanaProgram[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/program/[programId=stringSegment]', {
						programId: String(solanaProgram[EntityMetaKey.Selector].programId ?? ''),
						network: String(caip2StringFromValue(solanaProgram[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							solanaProgram[EntityMetaKey.Selector].$network != null && 'slug' in solanaProgram[EntityMetaKey.Selector].$network
							&& solanaProgram[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/program/[programId=stringSegment]', {
							programId: String(solanaProgram[EntityMetaKey.Selector].programId ?? ''),
							network: String(solanaProgram[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((solanaProgramFields.programId) ?? '')].filter(Boolean).join(' ') || 'solana program'}
			{/snippet}

			{#snippet Value()}
				{[String((solanaProgramFields.name) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((solanaProgramFields.$network.name) ?? '')].filter(Boolean).join(' ') || [solanaProgramFields.$network.caip2 == null ? '' : String(`${(solanaProgramFields.$network.caip2).namespace}:${(solanaProgramFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
