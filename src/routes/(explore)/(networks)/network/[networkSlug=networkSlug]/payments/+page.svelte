<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		params,
	} = $props()

	const network = useEntity(
		EntityType.Network,
		{
			networkSlug: params.networkSlug,
		},
		{
			$: [
				Source.Constants_Internal,
			],
			namespace: {},
			slug: {},
		},
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LightningPaymentsView from '$/views/LightningPaymentsView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{#if network.namespace === NetworkNamespace.Lightning}
				<LightningPaymentsView
					entityFieldReference={{
						entityType: EntityType.LightningNetwork,
						entityId: {
							$network: {
								networkSlug: network.slug,
							},
						},
						fieldName: '$$payments',
					}}
					href={`/network/${params.networkSlug}/payments`}
					id="payments"
				/>
			{:else}
				<p data-text="muted">This network does not expose a payments route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
