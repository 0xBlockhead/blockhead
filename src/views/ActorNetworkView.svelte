<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActorIdentityRow from '$/views/ActorIdentityRow.svelte'


	// Props
	let {
		children,
		entityId,
		title = 'Network actor',
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.ActorNetwork>
			title?: string
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.Network,
		entityId.$network,
		{
			$: [
				Source.Constants_Internal,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
			],
			name: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.ActorNetwork}
	{entityId}
	{title}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-row="inline wrap align-center gap-2">
			<ActorIdentityRow entityId={entityId.$actor} />

			<small data-text="muted">
				 ·{' '}

				<ResourceBoundary
					resource={network}
					placeholderText="···"
				>
					{#snippet children(chain)}
						{chain.name ?? String(chain[EntityMetaKey.Id].chainId)}
					{/snippet}
				</ResourceBoundary>
			</small>
		</span>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
	})}
		<dl>
			<div>
				<dt>Actor</dt>
				<dd>
					<ActorIdentityRow entityId={entityId.$actor} />
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<ResourceBoundary
						resource={network}
						placeholderText="Loading…"
					>
						{#snippet children(chain)}
							<samp data-text="font-monospace">
								{#if chain.name}
									{chain.name}
									<span data-text="muted">
										{' '}({String(chain[EntityMetaKey.Id].chainId)})
									</span>
								{:else}
									{String(chain[EntityMetaKey.Id].chainId)}
								{/if}
							</samp>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
