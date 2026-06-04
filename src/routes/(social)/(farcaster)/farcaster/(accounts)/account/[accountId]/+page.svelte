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
		entityId={{ fid: Number(params.accountId) }}
		title={'Account'}
	/>
</Page>
