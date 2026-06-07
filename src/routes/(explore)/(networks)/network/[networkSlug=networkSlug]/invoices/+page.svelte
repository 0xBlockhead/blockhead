<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
	import LightningInvoicesView from '$/views/LightningInvoicesView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{#if network.namespace === NetworkNamespace.Lightning}
				<LightningInvoicesView
					entityFieldReference={{
						entityType: EntityType.LightningNetwork,
						entityId: {
							$network: {
								networkSlug: network.slug,
							},
						},
						fieldName: '$$invoices',
					}}
						href={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/invoices', {
							networkSlug: params.networkSlug,
						})}
					id="invoices"
				/>
			{:else}
				<p data-text="muted">This network does not expose an invoices route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
