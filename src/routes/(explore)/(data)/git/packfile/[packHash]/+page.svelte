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
	import GitPackfileView from '$/views/GitPackfileView.svelte'
</script>


<Page>
	<GitPackfileView
		selection={select(EntityType.GitPackfile, data.selector)}
	/>
</Page>
