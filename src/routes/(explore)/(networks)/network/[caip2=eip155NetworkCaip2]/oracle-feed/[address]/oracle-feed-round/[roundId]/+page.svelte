<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import OracleFeed_RoundView from '$/views/OracleFeed_RoundView.svelte'
</script>


<Page>
	<OracleFeed_RoundView
		selection={select(EntityType.OracleFeed_Round, data.selector)}
	/>
</Page>
