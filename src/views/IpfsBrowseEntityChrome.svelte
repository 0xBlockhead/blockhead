<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		entityId,
		Form,
	}: {
		entityId: EntityId<typeof schema, EntityType.IpfsResource>
		Form: Snippet
	} = $props()


	// Functions
	import { ipfsResourceCanonicalUri, ipfsResourceHref } from '$/lib/ipfs.ts'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const ipfs = useEntity(
		EntityType.IpfsResource,
		entityId,
		{
			$: [Source.Ipfs_Rest],
			contentType: {},
			displayType: {},
			gatewayUrl: {},
			isContentTypeInferred: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	layout={EntityLayout.Details}
	entityType={EntityType.IpfsResource}
	{entityId}
	href={ipfsResourceHref(entityId)}
	title={ipfsResourceCanonicalUri(entityId)}
>
	{#snippet Details()}
		<section
			class="ipfs-browser"
			data-column
		>
			{@render Form()}

			<section
				class="ipfs-browser-note"
				data-card
				data-column
			>
				<h2>Browse IPFS</h2>

				<p data-text="muted">
					Current resource:
					<code>
						<TruncatedValue
							value={ipfsResourceCanonicalUri(entityId)}
							format={TruncatedValueFormat.Visual}
						/>
					</code>
				</p>

				<ResourceBoundary
					resource={ipfs}
					placeholderText="Loading gateway metadata…"
				>
					{#snippet children(loaded)}
						<dl>
							{#if loaded.gatewayUrl !== undefined}
								<div>
									<dt>Gateway URL</dt>
									<dd>
										<a
											href={loaded.gatewayUrl}
											target="_blank"
											rel="noreferrer noopener"
										>
											<TruncatedValue
												value={loaded.gatewayUrl}
												format={TruncatedValueFormat.Visual}
											/>
										</a>
									</dd>
								</div>
							{/if}
							{#if loaded.displayType !== undefined}
								<div>
									<dt>Display type</dt>
									<dd>{loaded.displayType}</dd>
								</div>
							{/if}
							{#if loaded.contentType !== undefined}
								<div>
									<dt>Content type</dt>
									<dd>
										<TruncatedValue
											value={loaded.contentType}
											format={TruncatedValueFormat.Visual}
										/>
										{#if loaded.isContentTypeInferred}
											{' '}
											<span data-text="muted">(inferred)</span>
										{/if}
									</dd>
								</div>
							{/if}
						</dl>
					{/snippet}
				</ResourceBoundary>
			</section>
		</section>
	{/snippet}
</EntityView>
