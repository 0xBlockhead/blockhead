<script lang="ts">
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'
</script>


<Page>
	<BlockheadFarcasterAccountConnectionView
		selector={{ fid: Number(params.accountId) }}
		title={'Account'}
	/>
</Page>
