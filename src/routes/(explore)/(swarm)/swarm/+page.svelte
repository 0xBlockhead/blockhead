<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import SwarmBrowseView from '$/views/SwarmBrowseView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title="Swarm"
		href={resolve('/swarm')}
	>
		<section>
			<SwarmBrowseView />
		</section>
	</GlobalView>
</Page>
