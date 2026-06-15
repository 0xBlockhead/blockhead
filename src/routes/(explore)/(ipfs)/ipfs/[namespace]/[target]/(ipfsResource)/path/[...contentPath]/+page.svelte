<script lang="ts">
	// State
	let {
		params,
	} = $props()

	import { ipfsResourceAddressFromRouteParams } from '$/lib/ipfs.ts'

	const selector = $derived(
		ipfsResourceAddressFromRouteParams({
			namespace: params.namespace,
			target: params.target,
			contentPath: params.contentPath,
		}),
	)


	// Components
	import Page from '$/components/Page.svelte'
	import IpfsResourceView from '$/views/IpfsResourceView.svelte'
</script>


{#if selector !== null}
	<Page>
		<IpfsResourceView
			selector={selector}
			open
		/>
	</Page>
{:else}
	<p role="alert">
		Invalid IPFS resource URL.
	</p>
{/if}
