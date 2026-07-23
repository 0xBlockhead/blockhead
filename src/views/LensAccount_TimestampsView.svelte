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




	// State
	let {
		selection,
		countResource,
		title = 'Lens account observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LensAccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LensAccount_Timestamp>
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
	entityType={EntityType.LensAccount_Timestamp}
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
				$account: true,
				timestampMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(lensAccountTimestamps) => [...new Map(lensAccountTimestamps.values.map((lensAccountTimestamp) => [lensAccountTimestamp[EntityMetaKey.SelectorKey], lensAccountTimestamp])).values()]}
	getKey={(lensAccountTimestamp) => lensAccountTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lens account observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: lensAccountTimestamp })}
		{@const lensAccountTimestampFields = { ...lensAccountTimestamp[EntityMetaKey.Selector], ...lensAccountTimestamp }}
		<EntityView
			entityType={EntityType.LensAccount_Timestamp}
			entitySelector={lensAccountTimestamp[EntityMetaKey.Selector]}
			href={
				(
					lensAccountTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in lensAccountTimestamp[EntityMetaKey.Selector]
					&& lensAccountTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& lensAccountTimestamp[EntityMetaKey.Selector] != null && '$account' in lensAccountTimestamp[EntityMetaKey.Selector]
					&& lensAccountTimestamp[EntityMetaKey.Selector].$account != null && 'address' in lensAccountTimestamp[EntityMetaKey.Selector].$account
					&& lensAccountTimestamp[EntityMetaKey.Selector].$account.address != null ?
						resolve('/lens/account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(lensAccountTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					address: String(lensAccountTimestamp[EntityMetaKey.Selector].$account.address ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((lensAccountTimestampFields.$account.displayName) ?? ''), String((lensAccountTimestampFields.$account.localName) ?? ''), String((lensAccountTimestampFields.$account.address) ?? ''), String((lensAccountTimestampFields.$account.legacyProfileId) ?? '')].filter(Boolean).join(' ') || 'Lens account'].filter(Boolean).join(' ') || 'Lens account observation'}
			{/snippet}

			{#snippet Value()}
				{[String((lensAccountTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
