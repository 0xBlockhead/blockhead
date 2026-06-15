<script lang="ts">
	// Types/constants
	import { type as arktype } from 'arktype'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		params,
	} = $props()
	const selector = $derived(
		((hashPrefix) => (
			hashPrefix instanceof arktype.errors ?
				undefined
			:
				{
					username: params.fname,
					hashPrefix,
				}
		))(ZeroExHex(params.hash)),
	)

	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<Page>
	{#if selector}
		<FarcasterCastView
			variant="feed"
			selector={selector}
		/>
	{/if}
</Page>
