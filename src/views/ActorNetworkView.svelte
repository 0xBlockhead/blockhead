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


	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActorIdentityRow from '$/views/ActorIdentityRow.svelte'
	import Address from '$/views/Address.svelte'


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

	const actor = useEntity(
		EntityType.Actor,
		entityId.$actor,
		{
			$: [
				Source.Voltaire_JsonRpc,
			],
			$primaryName: {},
			$icon: {},
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
	{#snippet Icon()}
		<ResourceBoundary resource={actor}>
			{#snippet children(actorRow)}
				{#if actorRow.$icon}
					<IconComponent
						shape={IconShape.Circle}
						src={actorRow.$icon[EntityMetaKey.Id].url}
						size="1.5em"
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary resource={actor}>
			{#snippet children(actorRow)}
				{actorRow.$primaryName?.[EntityMetaKey.Id].name ?? entityId.$actor.address}
			{/snippet}
		</ResourceBoundary>
		<small data-text="muted">
			{' '}·{' '}
			<ResourceBoundary
				resource={network}
				placeholderText="···"
			>
				{#snippet children(chain)}
					{chain.name ?? String(chain[EntityMetaKey.Id].chainId)}
				{/snippet}
			</ResourceBoundary>
		</small>
	{/snippet}

	{#snippet Id()}
		<Address
			address={entityId.$actor.address}
			network={entityId.$network}
		/>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
	})}
		<ResourceBoundary resource={actor}>
			{#snippet children(actorRow)}
				<dl>
					{#if actorRow.$primaryName}
						<div>
							<dt>Address</dt>
							<dd data-text="mono">
								{@render Id()}
							</dd>
						</div>
					{/if}
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
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
