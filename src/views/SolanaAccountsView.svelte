<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
import { stringify } from 'devalue'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Accounts',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SolanaAccount>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
</script>


<EntitiesList
	entityType={EntityType.SolanaAccount}
	{title}
	bind:open
	{id}
	{href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Solana accounts are the runtime state containers keyed by public key, with lamports, owner program, executable status, and rent epoch.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.Solana_JsonRpc,
					],
					limit: 16,
				})} placeholderText="Loading accounts…">
				{#snippet children(accounts)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.SolanaAccount}
				id={`${id}-items`}
				{href}
				getKey={(account) => stringify(account.entitySelector)}
				getSortValue={(account) => account.entitySelector.pubkey}
				open={true}
				items={accounts.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No recent accounts listed yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<SolanaAccountView
						selection={select(EntityType.SolanaAccount, item.entitySelector)}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
