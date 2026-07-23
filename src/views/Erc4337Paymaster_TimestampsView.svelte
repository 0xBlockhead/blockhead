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
		title = 'ERC-4337 paymaster observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337Paymaster_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Erc4337Paymaster_Timestamp>
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
	entityType={EntityType.Erc4337Paymaster_Timestamp}
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
				$paymaster: true,
			},
		})
	}
	{countResource}
	getResourceItems={(erc4337PaymasterTimestamps) => [...new Map(erc4337PaymasterTimestamps.values.map((erc4337PaymasterTimestamp) => [erc4337PaymasterTimestamp[EntityMetaKey.SelectorKey], erc4337PaymasterTimestamp])).values()]}
	getKey={(erc4337PaymasterTimestamp) => erc4337PaymasterTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ERC-4337 paymaster observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: erc4337PaymasterTimestamp })}
		{@const erc4337PaymasterTimestampFields = { ...erc4337PaymasterTimestamp[EntityMetaKey.Selector], ...erc4337PaymasterTimestamp }}
		<EntityView
			entityType={EntityType.Erc4337Paymaster_Timestamp}
			entitySelector={erc4337PaymasterTimestamp[EntityMetaKey.Selector]}
			href={
				(
					erc4337PaymasterTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in erc4337PaymasterTimestamp[EntityMetaKey.Selector]
					&& erc4337PaymasterTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& erc4337PaymasterTimestamp[EntityMetaKey.Selector] != null && 'source' in erc4337PaymasterTimestamp[EntityMetaKey.Selector]
					&& erc4337PaymasterTimestamp[EntityMetaKey.Selector].source != null
					&& erc4337PaymasterTimestamp[EntityMetaKey.Selector] != null && '$paymaster' in erc4337PaymasterTimestamp[EntityMetaKey.Selector]
					&& erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster != null && 'address' in erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster
					&& erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster.address != null
					&& erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster != null && '$network' in erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster ?
						erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster.$network != null && 'caip2' in erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster.$network
						&& erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(erc4337PaymasterTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(erc4337PaymasterTimestamp[EntityMetaKey.Selector].source ?? ''),
						address: String(erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster.address ?? ''),
						network: String(caip2StringFromValue(erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster.$network.caip2) ?? ''),
					})
					:
							erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster.$network != null && 'slug' in erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster.$network
							&& erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(erc4337PaymasterTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(erc4337PaymasterTimestamp[EntityMetaKey.Selector].source ?? ''),
							address: String(erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster.address ?? ''),
							network: String(erc4337PaymasterTimestamp[EntityMetaKey.Selector].$paymaster.$network.slug ?? ''),
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
				{[String((erc4337PaymasterTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 paymaster timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((erc4337PaymasterTimestampFields.userOperationsCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((erc4337PaymasterTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
