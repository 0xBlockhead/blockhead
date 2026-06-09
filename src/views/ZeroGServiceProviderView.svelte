<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'

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

	const serviceProvider = useEntity(entityCollectionsContext, EntityType.ZeroGServiceProvider, entityId, ({ fields: { serviceKind: true, $operator: true, verificationMethod: true, $$requests: true } }))


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
					{#if serviceProvider.fields.serviceKind != null}
						<div>
							<dt>Service</dt>
							<dd>{serviceProvider.fields.serviceKind}</dd>
						</div>
					{/if}

					{#if serviceProvider.fields.$operator != null}
						<div>
							<dt>Operator</dt>
							<dd>
								<EvmAccountView
									entityId={serviceProvider.fields.$operator[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if serviceProvider.fields.verificationMethod != null}
						<div>
							<dt>Verification</dt>
							<dd>{serviceProvider.fields.verificationMethod}</dd>
						</div>
					{/if}

					{#if serviceProvider.fields.$$requests != null && serviceProvider.fields.$$requests?.values.length}
						<div>
							<dt>Requests</dt>
							<dd>
								<ul>
									{#each serviceProvider.fields.$$requests.values as request (request[EntityMetaKey.Id].requestId)}
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
