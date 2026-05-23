<script lang="ts">
	// Functions
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
			contentPath: params.contentPath,
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
			href={swarmResourceHref(entityId)}
			open
		/>
	</Page>
{:else}
	<p role="alert">
		Invalid Swarm resource URL.
	</p>
{/if}
