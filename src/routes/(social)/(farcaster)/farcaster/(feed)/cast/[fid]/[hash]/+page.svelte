<script lang="ts">
	// Types/constants
	import { type as arktype } from 'arktype'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		params,
	} = $props()
	const entitySelector = $derived(
		((hash) => (
			hash instanceof arktype.errors ?
				undefined
			:
				{
					fid: Number(params.fid),
					hash,
				}
		))(ZeroExHex(params.hash)),
	)

	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<Page>
	{#if entitySelector}
		<FarcasterCastView
			variant="feed"
			selector={selector}
		/>
	{/if}
</Page>
