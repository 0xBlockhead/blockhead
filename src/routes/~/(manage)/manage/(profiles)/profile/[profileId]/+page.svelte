<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// Props
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
		href={resolve(
			'/~/(manage)/manage/(profiles)/profile/[profileId]',
			params,
		)}
	/>
</Page>
