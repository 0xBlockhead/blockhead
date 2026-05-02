<script lang="ts">
	// Functions
	import { ipfsResourceAddressFromRouteParams, ipfsResourceHref } from '$/lib/ipfs.ts'


	// State
	import Page from '$/components/Page.svelte'

	let {
		params,
	} = $props()

	const entityId = $derived(
		ipfsResourceAddressFromRouteParams({
			namespace: params.namespace,
			target: params.target,
		}),
	)


	// Components
	import IpfsResourceView from '$/views/IpfsResourceView.svelte'
</script>


{#if entityId !== undefined}
	<Page>
		<IpfsResourceView
			{entityId}
			href={ipfsResourceHref(entityId)}
			open
		/>
	</Page>
{:else}
	<p role="alert">
		Invalid IPFS resource URL.
	</p>
{/if}
