<script lang="ts">
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<Page>
	<FarcasterCastView
		variant="feed"
		entityId={{
			fid: Number(params.fid),
			hash: params.hash as `0x${string}`,
		}}
	/>
</Page>
