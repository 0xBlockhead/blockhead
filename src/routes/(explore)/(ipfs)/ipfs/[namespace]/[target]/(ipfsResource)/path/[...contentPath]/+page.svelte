<script lang="ts">
	// State
	let {
		params,
	} = $props()



	const entityId = $derived(
		ipfsResourceAddressFromRouteParams({
			namespace: params.namespace,
			target: params.target,
			contentPath: params.contentPath,
		}),
	)


	// Components
	import Page from '$/components/Page.svelte'
	import IpfsResourceView from '$/views/IpfsResourceView.svelte'


	// State
	import { ipfsResourceAddressFromRouteParams, ipfsResourceHref } from '$/lib/ipfs.ts'
</script>


{#if entityId !== undefined}
	<Page>
		<IpfsResourceView
			{entityId}
			open
		/>
	</Page>
{:else}
	<p role="alert">
		Invalid IPFS resource URL.
	</p>
{/if}
