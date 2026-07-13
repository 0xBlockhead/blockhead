<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'ERC-4337 smart account observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337SmartAccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Erc4337SmartAccount_Timestamp>
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
	import Erc4337SmartAccount_TimestampView from '$/views/Erc4337SmartAccount_TimestampView.svelte'
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
					timestampMs: true,
					userOperationsCount: true,
					source: true,
					$account: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337SmartAccount_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(erc4337SmartAccountTimestamps)}
			{@const uniqueErc4337SmartAccountTimestamps = [...new Map(erc4337SmartAccountTimestamps.values.map((erc4337SmartAccountTimestamp) => [erc4337SmartAccountTimestamp[EntityMetaKey.SelectorKey], erc4337SmartAccountTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337SmartAccount_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={erc4337SmartAccountTimestamps.totalCount}
				getKey={(erc4337SmartAccountTimestamp) => erc4337SmartAccountTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueErc4337SmartAccountTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ERC-4337 smart account observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: erc4337SmartAccountTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Erc4337SmartAccount_Timestamp> })}
					{@const erc4337SmartAccountTimestampFields = { ...erc4337SmartAccountTimestamp[EntityMetaKey.Selector], ...erc4337SmartAccountTimestamp }}
					{@const erc4337SmartAccountTimestampHrefFields = { ...erc4337SmartAccountTimestamp, ...erc4337SmartAccountTimestamp[EntityMetaKey.Selector] }}
					<Erc4337SmartAccount_TimestampView
						selection={select(EntityType.Erc4337SmartAccount_Timestamp, erc4337SmartAccountTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={erc4337SmartAccountTimestampFields}
						href={
							(erc4337SmartAccountTimestampHrefFields.$account !== undefined && erc4337SmartAccountTimestampHrefFields.$account.$network !== undefined && erc4337SmartAccountTimestampHrefFields.$account.$network.slug !== undefined && erc4337SmartAccountTimestampHrefFields.$account.address !== undefined && erc4337SmartAccountTimestampHrefFields.timestampMs !== undefined && erc4337SmartAccountTimestampHrefFields.source !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								network: String(erc4337SmartAccountTimestampHrefFields.$account.$network.slug ?? ''),
								address: String(erc4337SmartAccountTimestampHrefFields.$account.address ?? ''),
								timestampMs: String(erc4337SmartAccountTimestampHrefFields.timestampMs ?? ''),
								source: String(erc4337SmartAccountTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.Erc4337SmartAccount_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
