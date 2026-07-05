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
		title = 'EVM accounts',
		typeAnnotationParagraphs = ['An account address in the EVM address space, independent of any one chain.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmAccount>
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
	import EvmAccountView from '$/views/EvmAccountView.svelte'
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
					$avatar: true,
					address: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(evmAccounts)}
			{@const uniqueEvmAccounts = [...new Map(evmAccounts.values.map((evmAccount) => [evmAccount[EntityMetaKey.SelectorKey], evmAccount])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmAccount}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmAccounts.totalCount}
				getKey={(evmAccount) => evmAccount[EntityMetaKey.SelectorKey]}
				items={uniqueEvmAccounts}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM accounts yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmAccount }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmAccount> })}
					{@const evmAccountFields = { ...evmAccount[EntityMetaKey.Selector], ...evmAccount }}
					{@const evmAccountHrefFields = { ...evmAccount, ...evmAccount[EntityMetaKey.Selector] }}
					<EvmAccountView
						selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
						prefetched={evmAccountFields}
						href={
							(evmAccountHrefFields.address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
								address: String(evmAccountHrefFields.address ?? ''),
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
		entityType={EntityType.EvmAccount}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
