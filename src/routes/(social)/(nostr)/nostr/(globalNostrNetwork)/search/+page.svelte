<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'


	// Context
	import { select } from '$/routes/+layout.svelte'



													let query = $state('')
												


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Search Nostr profiles • Blockhead</title>
</svelte:head>


<Page>

														<form
															method="GET"
															data-card
															data-column="gap-3"
															onsubmit={(event) => {
																event.preventDefault()
																const normalizedQuery = query.trim().replace(/\s+/g, ' ')
																if (normalizedQuery !== '')
												void goto(resolve(`/nostr/search/${encodeURIComponent(normalizedQuery)}`))
															}}
														>
															<label data-column="gap-2">
																<span>Search Nostr profiles</span>
																<input
																	name="query"
																	type="search"
																	required
																	maxlength="64"
																	autocomplete="off"
																	bind:value={query}
																/>
															</label>

															<button type="submit">Search</button>
														</form>
													
</Page>
