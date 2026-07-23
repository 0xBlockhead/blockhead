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
		title = 'ERC-4337 bundler observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337Bundler_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Erc4337Bundler_Timestamp>
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
	entityType={EntityType.Erc4337Bundler_Timestamp}
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
				timestampMs: true,
				userOperationsCount: true,
				source: true,
				$bundler: true,
			},
		})
	}
	{countResource}
	getResourceItems={(erc4337BundlerTimestamps) => [...new Map(erc4337BundlerTimestamps.values.map((erc4337BundlerTimestamp) => [erc4337BundlerTimestamp[EntityMetaKey.SelectorKey], erc4337BundlerTimestamp])).values()]}
	getKey={(erc4337BundlerTimestamp) => erc4337BundlerTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ERC-4337 bundler observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: erc4337BundlerTimestamp })}
		{@const erc4337BundlerTimestampFields = { ...erc4337BundlerTimestamp[EntityMetaKey.Selector], ...erc4337BundlerTimestamp }}
		<EntityView
			entityType={EntityType.Erc4337Bundler_Timestamp}
			entitySelector={erc4337BundlerTimestamp[EntityMetaKey.Selector]}
			href={
				(
					erc4337BundlerTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in erc4337BundlerTimestamp[EntityMetaKey.Selector]
					&& erc4337BundlerTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& erc4337BundlerTimestamp[EntityMetaKey.Selector] != null && 'source' in erc4337BundlerTimestamp[EntityMetaKey.Selector]
					&& erc4337BundlerTimestamp[EntityMetaKey.Selector].source != null
					&& erc4337BundlerTimestamp[EntityMetaKey.Selector] != null && '$bundler' in erc4337BundlerTimestamp[EntityMetaKey.Selector]
					&& erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler != null && 'address' in erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler
					&& erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler.address != null
					&& erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler != null && '$network' in erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler ?
						erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler.$network != null && 'caip2' in erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler.$network
						&& erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(erc4337BundlerTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(erc4337BundlerTimestamp[EntityMetaKey.Selector].source ?? ''),
						address: String(erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler.address ?? ''),
						network: String(caip2StringFromValue(erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler.$network.caip2) ?? ''),
					})
					:
							erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler.$network != null && 'slug' in erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler.$network
							&& erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(erc4337BundlerTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(erc4337BundlerTimestamp[EntityMetaKey.Selector].source ?? ''),
							address: String(erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler.address ?? ''),
							network: String(erc4337BundlerTimestamp[EntityMetaKey.Selector].$bundler.$network.slug ?? ''),
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
				{[String((erc4337BundlerTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 bundler timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((erc4337BundlerTimestampFields.userOperationsCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((erc4337BundlerTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
