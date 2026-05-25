<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'

	import {
		ensTextRecordLabels,
		ensTextRecordLinkEntries as ensTextRecordLinks,
		EnsTextRecordHrefMode,
	} from '$/constants/Ens.ts'

	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
			'/(explore)/(ens)/ens/name/[ensName]',
			{ ensName: entityId.name },
		),
		recordId,
	}: {
		entityId: EntityId<typeof schema, EntityType.EnsName>
		href?: string
		recordId: string
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


	// (Derived)
	const recordLabel = $derived(
		ensTextRecordLabels[recordId]?.label ?? recordId,
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	href={href}
	title={recordLabel}
>
	{#snippet Value()}
		<span>{recordLabel}</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<span>{recordLabel}</span>
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
			{#snippet children(loadedEns)}
				{@const recordValue = loadedEns.textRecords?.[recordId]}
				{@const textRecordLinkEntry = ensTextRecordLinks.find((candidate) => (
					candidate.keys.some((candidateKey) => candidateKey === recordId)
				))}
				{@const externalHref = (
					recordValue !== undefined && textRecordLinkEntry != null ?
						(
							textRecordLinkEntry.hrefMode === EnsTextRecordHrefMode.Value ?
								recordValue
							: textRecordLinkEntry.hrefMode === EnsTextRecordHrefMode.Mailto ?
								`mailto:${recordValue}`
							: textRecordLinkEntry.hrefMode === EnsTextRecordHrefMode.Prefix ?
								`${textRecordLinkEntry.urlPrefix ?? ''}${recordValue}`
							: textRecordLinkEntry.hrefMode === EnsTextRecordHrefMode.PrefixStripAt ?
								`${textRecordLinkEntry.urlPrefix ?? ''}${recordValue.startsWith('@') ? recordValue.slice(1) : recordValue}`
							:
								null
						)
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
							{#if (
								recordValue !== undefined
								&& externalHref !== undefined
								&& (
									externalHref.startsWith('http://')
									|| externalHref.startsWith('https://')
									|| externalHref.startsWith('mailto:')
								)
							)}
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
							{:else if recordValue !== undefined}
								<TruncatedValue
									value={recordValue}
									format={TruncatedValueFormat.Visual}
								/>
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
