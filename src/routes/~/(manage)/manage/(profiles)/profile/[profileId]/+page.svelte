<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
</script>


<Page>
	<BlockheadSessionView
		entityId={{ id: params.profileId }}
	/>
</Page>
