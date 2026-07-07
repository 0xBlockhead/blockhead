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
		title = 'ERC-4337 bundler observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337Bundler_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Erc4337Bundler_Timestamp>
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
	import Erc4337Bundler_TimestampView from '$/views/Erc4337Bundler_TimestampView.svelte'
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
					$bundler: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337Bundler_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(erc4337BundlerTimestamps)}
			{@const uniqueErc4337BundlerTimestamps = [...new Map(erc4337BundlerTimestamps.values.map((erc4337BundlerTimestamp) => [erc4337BundlerTimestamp[EntityMetaKey.SelectorKey], erc4337BundlerTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337Bundler_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={erc4337BundlerTimestamps.totalCount}
				getKey={(erc4337BundlerTimestamp) => erc4337BundlerTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueErc4337BundlerTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ERC-4337 bundler observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: erc4337BundlerTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Erc4337Bundler_Timestamp> })}
					{@const erc4337BundlerTimestampFields = { ...erc4337BundlerTimestamp[EntityMetaKey.Selector], ...erc4337BundlerTimestamp }}
					{@const erc4337BundlerTimestampHrefFields = { ...erc4337BundlerTimestamp, ...erc4337BundlerTimestamp[EntityMetaKey.Selector] }}
					<Erc4337Bundler_TimestampView
						selection={select(EntityType.Erc4337Bundler_Timestamp, erc4337BundlerTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={erc4337BundlerTimestampFields}
						href={
							(erc4337BundlerTimestampHrefFields.$bundler !== undefined && erc4337BundlerTimestampHrefFields.$bundler.$network !== undefined && erc4337BundlerTimestampHrefFields.$bundler.$network.caip2 !== undefined && erc4337BundlerTimestampHrefFields.$bundler.$network.caip2.namespace !== undefined && erc4337BundlerTimestampHrefFields.$bundler !== undefined && erc4337BundlerTimestampHrefFields.$bundler.$network !== undefined && erc4337BundlerTimestampHrefFields.$bundler.$network.caip2 !== undefined && erc4337BundlerTimestampHrefFields.$bundler.$network.caip2.reference !== undefined && erc4337BundlerTimestampHrefFields.$bundler !== undefined && erc4337BundlerTimestampHrefFields.$bundler.address !== undefined && erc4337BundlerTimestampHrefFields.timestampMs !== undefined && erc4337BundlerTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/bundler/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(erc4337BundlerTimestampHrefFields.$bundler.$network.caip2.namespace ?? '')}:${String(erc4337BundlerTimestampHrefFields.$bundler.$network.caip2.reference ?? '')}`,
								address: String(erc4337BundlerTimestampHrefFields.$bundler.address ?? ''),
								timestampMs: String(erc4337BundlerTimestampHrefFields.timestampMs ?? ''),
								source: String(erc4337BundlerTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.Erc4337Bundler_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
