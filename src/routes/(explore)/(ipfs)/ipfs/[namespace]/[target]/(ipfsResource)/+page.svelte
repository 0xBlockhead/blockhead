<script lang="ts">
	// State
	let {
		params,
	} = $props()

	import { ipfsResourceAddressFromRouteParams } from '$/lib/ipfs.ts'

	const entitySelector = $derived(
		ipfsResourceAddressFromRouteParams({
			namespace: params.namespace,
			target: params.target,
		}),
	)


	// Components
	import Page from '$/components/Page.svelte'
	import IpfsResourceView from '$/views/IpfsResourceView.svelte'
</script>


{#if entitySelector !== null}
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
