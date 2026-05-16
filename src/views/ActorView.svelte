<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Props
	let {
		children,
		entityId,
		title = 'Account',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Actor>
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	const actor = useEntity(
		EntityType.Actor,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
				Source.TheGraph_Graphql,
			],
			$primaryName: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
			$icon: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$ensNamesOwned: {
				$: [
					Source.TheGraph_Graphql,
				],
			},
		},
	)
</script>


<EntityView
	entityType={EntityType.Actor}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Icon()}
		<ResourceBoundary resource={actor}>
			{#snippet children(actorSummaryRow)}
				{#if actorSummaryRow.$icon}
					<IconComponent
						shape={IconShape.Circle}
						src={actorSummaryRow.$icon[EntityMetaKey.Id].url}
						size="1.5em"
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary resource={actor}>
			{#snippet children(actorSummaryRow)}
				{actorSummaryRow.$primaryName?.[EntityMetaKey.Id].name ?? entityId.address}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			<TruncatedValue
				value={entityId.address}
				format={TruncatedValueFormat.Visual}
			/>
		</span>
	{/snippet}



	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={actor}>
			{#snippet children(actorSummaryRow)}
				<dl>
					{#if actorSummaryRow.$primaryName}
						<div>
							<dt>Address</dt>
							<dd data-text="mono">
								{@render Id()}
							</dd>
						</div>
					{/if}
					{#if open}
						{#if entityId.interopAddress}
							<div>
								<dt>Interop</dt>
								<dd>
									<TruncatedValue
										value={entityId.interopAddress}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}
						<div>
							<dt>ENS names (The Graph)</dt>
							<dd>
								<ul>
									{#each actorSummaryRow.$$ensNamesOwned as nameRef (`${nameRef[EntityMetaKey.Id].name}`)}
										<li>
											<a
												data-link
												href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
													ensName: nameRef[EntityMetaKey.Id].name,
												})}
											>{nameRef[EntityMetaKey.Id].name}</a>
										</li>
									{/each}
								</ul>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Actor}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
