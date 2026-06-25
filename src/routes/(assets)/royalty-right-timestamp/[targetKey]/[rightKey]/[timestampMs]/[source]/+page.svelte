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
	import RoyaltyRight_TimestampView from '$/views/RoyaltyRight_TimestampView.svelte'
</script>


<Page>
	<RoyaltyRight_TimestampView
		selection={select(EntityType.RoyaltyRight_Timestamp, data.selector)}
	/>
</Page>
