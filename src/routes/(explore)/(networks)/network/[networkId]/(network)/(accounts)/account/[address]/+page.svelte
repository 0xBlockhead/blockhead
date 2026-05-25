<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// State
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
</script>


<Page>
	<ActorNetworkView
		entityId={data.entityId}
	/>
</Page>
