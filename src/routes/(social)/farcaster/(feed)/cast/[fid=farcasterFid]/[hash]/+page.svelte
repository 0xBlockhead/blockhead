<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { type as arktype } from 'arktype'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		params,
	} = $props()
	const selector = $derived(
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
	{#if selector}
		<FarcasterCastView
			variant="feed"
			selection={select(EntityType.FarcasterCast, selector)}
		/>
	{/if}
</Page>
