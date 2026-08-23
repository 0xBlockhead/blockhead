<script lang="ts">
	// Types/constants
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'


	// Context
	import { writeLocalBlockheadSession } from '$/collections/localMutations.ts'
	import { getAppClient } from '$/routes/+layout.svelte'


	// State
	let sessionName = $state('')
</script>


<form
	data-card
	data-column="gap-3"
	onsubmit={async (event) => {
		event.preventDefault()
		const sessionSelector = await writeLocalBlockheadSession(
			getAppClient(),
			{ scope: '$$blockheadSessions' },
			sessionName,
		)
		sessionName = ''
		await goto(resolve(
			'/~/session/[sessionId=stringSegment]',
			{
				sessionId: sessionSelector.id,
			}
		))
	}}
>
	<header data-row="between wrap align-center gap-2">
		<h2>New session</h2>
		<span data-text="annotation">Draft workspace</span>
	</header>

	<label for="blockhead-session-name">Session name</label>

	<input
		id="blockhead-session-name"
		name="sessionName"
		bind:value={sessionName}
		autocomplete="off"
		placeholder="New session"
		required
	/>

	<button type="submit">Create session</button>
</form>
