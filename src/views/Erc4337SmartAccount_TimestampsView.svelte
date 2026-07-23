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
		title = 'ERC-4337 smart account observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337SmartAccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Erc4337SmartAccount_Timestamp>
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
	entityType={EntityType.Erc4337SmartAccount_Timestamp}
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
				$account: true,
			},
		})
	}
	{countResource}
	getResourceItems={(erc4337SmartAccountTimestamps) => [...new Map(erc4337SmartAccountTimestamps.values.map((erc4337SmartAccountTimestamp) => [erc4337SmartAccountTimestamp[EntityMetaKey.SelectorKey], erc4337SmartAccountTimestamp])).values()]}
	getKey={(erc4337SmartAccountTimestamp) => erc4337SmartAccountTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ERC-4337 smart account observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: erc4337SmartAccountTimestamp })}
		{@const erc4337SmartAccountTimestampFields = { ...erc4337SmartAccountTimestamp[EntityMetaKey.Selector], ...erc4337SmartAccountTimestamp }}
		<EntityView
			entityType={EntityType.Erc4337SmartAccount_Timestamp}
			entitySelector={erc4337SmartAccountTimestamp[EntityMetaKey.Selector]}
			href={
				(
					erc4337SmartAccountTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in erc4337SmartAccountTimestamp[EntityMetaKey.Selector]
					&& erc4337SmartAccountTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& erc4337SmartAccountTimestamp[EntityMetaKey.Selector] != null && 'source' in erc4337SmartAccountTimestamp[EntityMetaKey.Selector]
					&& erc4337SmartAccountTimestamp[EntityMetaKey.Selector].source != null
					&& erc4337SmartAccountTimestamp[EntityMetaKey.Selector] != null && '$account' in erc4337SmartAccountTimestamp[EntityMetaKey.Selector]
					&& erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account != null && 'address' in erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account
					&& erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account.address != null
					&& erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account != null && '$network' in erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account ?
						erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account.$network != null && 'caip2' in erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account.$network
						&& erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(erc4337SmartAccountTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(erc4337SmartAccountTimestamp[EntityMetaKey.Selector].source ?? ''),
						address: String(erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account.address ?? ''),
						network: String(caip2StringFromValue(erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account.$network.caip2) ?? ''),
					})
					:
							erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account.$network != null && 'slug' in erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account.$network
							&& erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(erc4337SmartAccountTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(erc4337SmartAccountTimestamp[EntityMetaKey.Selector].source ?? ''),
							address: String(erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account.address ?? ''),
							network: String(erc4337SmartAccountTimestamp[EntityMetaKey.Selector].$account.$network.slug ?? ''),
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
				{[String((erc4337SmartAccountTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 smart account timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((erc4337SmartAccountTimestampFields.userOperationsCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((erc4337SmartAccountTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
