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
		title = 'Account snapshots',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotAccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.PolkadotAccount_Timestamp>
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
	import PolkadotAccount_TimestampView from '$/views/PolkadotAccount_TimestampView.svelte'
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
					source: true,
					freeBalancePlancks: true,
					nonce: true,
					timestampMs: true,
					$account: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotAccount_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(polkadotAccountTimestamps)}
			{@const uniquePolkadotAccountTimestamps = [...new Map(polkadotAccountTimestamps.values.map((polkadotAccountTimestamp) => [polkadotAccountTimestamp[EntityMetaKey.SelectorKey], polkadotAccountTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotAccount_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={polkadotAccountTimestamps.totalCount}
				getKey={(polkadotAccountTimestamp) => polkadotAccountTimestamp[EntityMetaKey.SelectorKey]}
				items={uniquePolkadotAccountTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Polkadot account observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: polkadotAccountTimestamp })}
					{@const polkadotAccountTimestampFields = { ...polkadotAccountTimestamp[EntityMetaKey.Selector], ...polkadotAccountTimestamp }}
					{@const selection = select(EntityType.PolkadotAccount_Timestamp, polkadotAccountTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const polkadotAccountTimestampHrefFields = { ...polkadotAccountTimestamp, ...polkadotAccountTimestamp[EntityMetaKey.Selector] }}
					<PolkadotAccount_TimestampView
						selection={selection}
						prefetched={polkadotAccountTimestampFields}
						href={
							(polkadotAccountTimestampHrefFields.timestampMs !== undefined && polkadotAccountTimestampHrefFields.source !== undefined && polkadotAccountTimestampHrefFields.$account !== undefined && polkadotAccountTimestampHrefFields.$account.accountId !== undefined && polkadotAccountTimestampHrefFields.$account.$network !== undefined && polkadotAccountTimestampHrefFields.$account.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(polkadotAccountTimestampHrefFields.timestampMs ?? ''),
								source: String(polkadotAccountTimestampHrefFields.source ?? ''),
								accountId: String(polkadotAccountTimestampHrefFields.$account.accountId ?? ''),
								network: String(caip2StringFromValue(polkadotAccountTimestampHrefFields.$account.$network.caip2) ?? ''),
							}) : polkadotAccountTimestampHrefFields.timestampMs !== undefined && polkadotAccountTimestampHrefFields.source !== undefined && polkadotAccountTimestampHrefFields.$account !== undefined && polkadotAccountTimestampHrefFields.$account.accountId !== undefined && polkadotAccountTimestampHrefFields.$account.$network !== undefined && polkadotAccountTimestampHrefFields.$account.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(polkadotAccountTimestampHrefFields.timestampMs ?? ''),
								source: String(polkadotAccountTimestampHrefFields.source ?? ''),
								accountId: String(polkadotAccountTimestampHrefFields.$account.accountId ?? ''),
								network: String(polkadotAccountTimestampHrefFields.$account.$network.slug ?? ''),
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
		entityType={EntityType.PolkadotAccount_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
