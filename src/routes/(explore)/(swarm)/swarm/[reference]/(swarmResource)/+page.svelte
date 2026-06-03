<script lang="ts">
	// Types/constants
	import {
		getResourceAddressFromRouteParams,
		getResourceHref,
	} from '$/sources/Swarm/Rest/queries.ts'


	// State
	let {
		params,
	} = $props()

	const entityId = $derived(
		getResourceAddressFromRouteParams({
			reference: params.reference,
		}),
	)


	// Components
	import Page from '$/components/Page.svelte'
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


{#if entityId !== undefined}
	<Page>
		<SwarmResourceView
			{entityId}
			open
		/>
	</Page>
{:else}
	<p role="alert">
		Invalid Swarm resource URL.
	</p>
{/if}
