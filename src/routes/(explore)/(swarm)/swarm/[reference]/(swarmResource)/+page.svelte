<script lang="ts">
	// Types/constants
	import {
		swarmResourceAddressFromRouteParams,
		swarmResourceHref,
	} from '$/sources/Swarm/Rest/queries.ts'


	// Props
	let {
		params,
	} = $props()


	// (Derived)

	const entityId = $derived(
		swarmResourceAddressFromRouteParams({
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
