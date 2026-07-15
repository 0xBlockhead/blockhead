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
		title = 'EVM contract verifications',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmContractVerifications-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmContractVerification>
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
	import EvmContractVerificationView from '$/views/EvmContractVerificationView.svelte'
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
					match: true,
					runtimeMatch: true,
					$contract: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmContractVerification}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmContractVerifications)}
			{@const uniqueEvmContractVerifications = [...new Map(evmContractVerifications.values.map((evmContractVerification) => [evmContractVerification[EntityMetaKey.SelectorKey], evmContractVerification])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmContractVerification}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmContractVerifications.totalCount}
				getKey={(evmContractVerification) => evmContractVerification[EntityMetaKey.SelectorKey]}
				items={uniqueEvmContractVerifications}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM contract verifications yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmContractVerification })}
					{@const evmContractVerificationFields = { ...evmContractVerification[EntityMetaKey.Selector], ...evmContractVerification }}
					{@const selection = select(EntityType.EvmContractVerification, evmContractVerification[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const evmContractVerificationHrefFields = { ...evmContractVerification, ...evmContractVerification[EntityMetaKey.Selector] }}
					<EvmContractVerificationView
						selection={selection}
						prefetched={evmContractVerificationFields}
						href={
							(evmContractVerificationHrefFields.$contract !== undefined && evmContractVerificationHrefFields.$contract.address !== undefined && evmContractVerificationHrefFields.$contract.$network !== undefined && evmContractVerificationHrefFields.$contract.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]/verification', {
								address: String(evmContractVerificationHrefFields.$contract.address ?? ''),
								network: String(caip2StringFromValue(evmContractVerificationHrefFields.$contract.$network.caip2) ?? ''),
							}) : evmContractVerificationHrefFields.$contract !== undefined && evmContractVerificationHrefFields.$contract.address !== undefined && evmContractVerificationHrefFields.$contract.$network !== undefined && evmContractVerificationHrefFields.$contract.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]/verification', {
								address: String(evmContractVerificationHrefFields.$contract.address ?? ''),
								network: String(evmContractVerificationHrefFields.$contract.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmContractVerification}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
