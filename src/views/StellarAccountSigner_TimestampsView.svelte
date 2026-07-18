<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Stellar account signer observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'StellarAccountSigner_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.StellarAccountSigner_Timestamp>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import StellarAccountSigner_TimestampView from '$/views/StellarAccountSigner_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarAccountSigner_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	getResourceItems={(stellarAccountSignerTimestamps) => [...new Map(stellarAccountSignerTimestamps.values.map((stellarAccountSignerTimestamp) => [stellarAccountSignerTimestamp[EntityMetaKey.SelectorKey], stellarAccountSignerTimestamp])).values()]}
	getKey={(stellarAccountSignerTimestamp) => stellarAccountSignerTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Stellar account signer observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: stellarAccountSignerTimestamp })}
		{@const stellarAccountSignerTimestampFields = { ...stellarAccountSignerTimestamp[EntityMetaKey.Selector], ...stellarAccountSignerTimestamp }}
		{@const selection = select(EntityType.StellarAccountSigner_Timestamp, stellarAccountSignerTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<StellarAccountSigner_TimestampView
			selection={selection}
			prefetched={stellarAccountSignerTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
