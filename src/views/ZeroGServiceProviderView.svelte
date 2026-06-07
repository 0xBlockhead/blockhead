<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ZeroGServiceProvider>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const serviceProvider = useEntity(EntityType.ZeroGServiceProvider, entityId, {
		serviceKind: {},
		$operator: {},
		verificationMethod: {},
		$$requests: {},
	})


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGServiceRequestView from '$/views/ZeroGServiceRequestView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGServiceProvider}
	{entityId}
	title={entityId.providerId}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={entityId.providerId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>A 0G service provider offers serving, inference, or related AI service capacity with verifiable settlement metadata.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={serviceProvider}
			placeholderText="Loading 0G service provider…"
		>
			{#snippet children(serviceProvider)}
				<dl>
					{#if serviceProvider.serviceKind != null}
						<div>
							<dt>Service</dt>
							<dd>{serviceProvider.serviceKind}</dd>
						</div>
					{/if}

					{#if serviceProvider.$operator != null}
						<div>
							<dt>Operator</dt>
							<dd>
								<EvmAccountView
									entityId={serviceProvider.$operator[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if serviceProvider.verificationMethod != null}
						<div>
							<dt>Verification</dt>
							<dd>{serviceProvider.verificationMethod}</dd>
						</div>
					{/if}

					{#if serviceProvider.$$requests != null && serviceProvider.$$requests.length}
						<div>
							<dt>Requests</dt>
							<dd>
								<ul>
									{#each serviceProvider.$$requests as request (request[EntityMetaKey.Id].requestId)}
										<li>
											<ZeroGServiceRequestView
												entityId={request[EntityMetaKey.Id]}
												layout={EntityLayout.Title}
												open={false}
											/>
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
</EntityView>
