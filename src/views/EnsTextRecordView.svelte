<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import {
		getEnsTextRecordHref,
		getEnsTextRecordLabel,
	} from '$/constants/Ens.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		entityId,
		recordId,
		href,
	}: {
		entityId: EntityId<typeof schema, EntityType.EnsName>
		recordId: string
		href: string
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const ens = useEntity(
		EntityType.EnsName,
		entityId,
		{
			$: [Source.Voltaire_JsonRpc],
			textRecords: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	{href}
	title={getEnsTextRecordLabel(recordId)}
>
	{#snippet Value()}
		<span>{getEnsTextRecordLabel(recordId)}</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<span>{getEnsTextRecordLabel(recordId)}</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			ENS text records are resolver-stored profile fields keyed by the name’s on-chain node hash.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			placeholderText="Loading text record…"
			resource={ens}
		>
			{#snippet children(ens)}
				{@const recordValue = ens.textRecords?.[recordId]}
				{@const externalHref = (
					recordValue !== undefined ?
						getEnsTextRecordHref(recordId, recordValue)
					:
						undefined
				)}
				<dl data-column-item="center">
					<div>
						<dt>ENS name</dt>
						<dd data-text="font-monospace">{entityId.name}</dd>
					</div>
					<div>
						<dt>Value</dt>
						<dd>
							{#if recordValue !== undefined}
								{#if externalHref !== undefined && (externalHref.startsWith('http://') || externalHref.startsWith('https://') || externalHref.startsWith('mailto:'))}
									<button
										data-button="unstyled"
										data-link
										onclick={() => {
											window.open(
												externalHref,
												'_blank',
												'noopener,noreferrer',
											)
										}}
										type="button"
									>
										<TruncatedValue
											value={recordValue}
											format={TruncatedValueFormat.Visual}
										/>
									</button>
								{:else}
									<TruncatedValue
										value={recordValue}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{:else}
								<span data-text="muted">
									No value for this key on the Voltaire resolver row yet.
								</span>
							{/if}
						</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
