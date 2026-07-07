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
		title = 'ERC-4337 paymaster observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337Paymaster_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Erc4337Paymaster_Timestamp>
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
	import Erc4337Paymaster_TimestampView from '$/views/Erc4337Paymaster_TimestampView.svelte'
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
					$paymaster: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337Paymaster_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(erc4337PaymasterTimestamps)}
			{@const uniqueErc4337PaymasterTimestamps = [...new Map(erc4337PaymasterTimestamps.values.map((erc4337PaymasterTimestamp) => [erc4337PaymasterTimestamp[EntityMetaKey.SelectorKey], erc4337PaymasterTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337Paymaster_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={erc4337PaymasterTimestamps.totalCount}
				getKey={(erc4337PaymasterTimestamp) => erc4337PaymasterTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueErc4337PaymasterTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ERC-4337 paymaster observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: erc4337PaymasterTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Erc4337Paymaster_Timestamp> })}
					{@const erc4337PaymasterTimestampFields = { ...erc4337PaymasterTimestamp[EntityMetaKey.Selector], ...erc4337PaymasterTimestamp }}
					{@const erc4337PaymasterTimestampHrefFields = { ...erc4337PaymasterTimestamp, ...erc4337PaymasterTimestamp[EntityMetaKey.Selector] }}
					<Erc4337Paymaster_TimestampView
						selection={select(EntityType.Erc4337Paymaster_Timestamp, erc4337PaymasterTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={erc4337PaymasterTimestampFields}
						href={
							(erc4337PaymasterTimestampHrefFields.$paymaster !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.$network !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.$network.caip2 !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.$network.caip2.namespace !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.$network !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.$network.caip2 !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.$network.caip2.reference !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.address !== undefined && erc4337PaymasterTimestampHrefFields.timestampMs !== undefined && erc4337PaymasterTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/paymaster/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(erc4337PaymasterTimestampHrefFields.$paymaster.$network.caip2.namespace ?? '')}:${String(erc4337PaymasterTimestampHrefFields.$paymaster.$network.caip2.reference ?? '')}`,
								address: String(erc4337PaymasterTimestampHrefFields.$paymaster.address ?? ''),
								timestampMs: String(erc4337PaymasterTimestampHrefFields.timestampMs ?? ''),
								source: String(erc4337PaymasterTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.Erc4337Paymaster_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
