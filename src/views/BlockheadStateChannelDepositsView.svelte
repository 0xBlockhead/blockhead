<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Blockhead state channel deposits',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadStateChannelDeposits-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadStateChannelDeposit>
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
	entityType={EntityType.BlockheadStateChannelDeposit}
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
				$account: true,
				$network: true,
				$channel: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadStateChannelDeposits) => [...new Map(blockheadStateChannelDeposits.values.map((blockheadStateChannelDeposit) => [blockheadStateChannelDeposit[EntityMetaKey.SelectorKey], blockheadStateChannelDeposit])).values()]}
	getKey={(blockheadStateChannelDeposit) => blockheadStateChannelDeposit[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead state channel deposits yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadStateChannelDeposit })}
		{@const blockheadStateChannelDepositFields = { ...blockheadStateChannelDeposit[EntityMetaKey.Selector], ...blockheadStateChannelDeposit }}
		<EntityView
			entityType={EntityType.BlockheadStateChannelDeposit}
			entitySelector={blockheadStateChannelDeposit[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((blockheadStateChannelDepositFields.$account.address) ?? '')].filter(Boolean).join(' ') || 'EVM account'].filter(Boolean).join(' ') || 'blockhead state channel deposit'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadStateChannelDepositFields.$network.name) ?? '')].filter(Boolean).join(' ') || [blockheadStateChannelDepositFields.$network.caip2 == null ? '' : String(`${(blockheadStateChannelDepositFields.$network.caip2).namespace}:${(blockheadStateChannelDepositFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((blockheadStateChannelDepositFields.$channel.id) ?? '')].filter(Boolean).join(' ') || 'blockhead state channel'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
