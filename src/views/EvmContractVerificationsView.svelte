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
		title = 'EVM contract verifications',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading EVM contract verifications...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmContractVerifications-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmContractVerification>
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
			selection.sources == null ? selection({
				fields: {
					match: true,
					runtimeMatch: true,
					$contract: true,
				},
			}) : selection
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
				totalCount={evmContractVerifications.values.length === uniqueEvmContractVerifications.length && evmContractVerifications.totalCount != null && evmContractVerifications.totalCount >= uniqueEvmContractVerifications.length ? evmContractVerifications.totalCount : uniqueEvmContractVerifications.length}
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

				{#snippet Item({ item: evmContractVerification }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmContractVerification> })}
					<EvmContractVerificationView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]/verification', {
								caip2: `${String(({ ...evmContractVerification.entitySelector, ...evmContractVerification }).caip2.namespace)}:${String(({ ...evmContractVerification.entitySelector, ...evmContractVerification }).caip2.reference)}`,
								address: String(({ ...evmContractVerification.entitySelector, ...evmContractVerification }).$contract.address),
							})
						}
						selection={select(EntityType.EvmContractVerification, evmContractVerification.entitySelector)}
						prefetched={evmContractVerification}
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
		entityType={EntityType.EvmContractVerification}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
