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
	import XrplAccount_TimestampView from '$/views/XrplAccount_TimestampView.svelte'
</script>


<Page>
	<XrplAccount_TimestampView
		selection={select(EntityType.XrplAccount_Timestamp, data.selector)}
	/>
</Page>
