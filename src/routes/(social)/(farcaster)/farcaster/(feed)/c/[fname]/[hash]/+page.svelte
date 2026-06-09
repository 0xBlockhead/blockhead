<script lang="ts">
	// Types/constants
	import { type as arktype } from 'arktype'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		params,
	} = $props()
	const entityId = $derived(
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
	{#if entityId}
		<FarcasterCastView
			variant="feed"
			{entityId}
		/>
	{/if}
</Page>
