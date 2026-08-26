<script lang="ts">
	// Types/constants
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'


	// Context
	import {
		writeLocalBlockheadPanel,
		writeLocalBlockheadPanelTree,
		writeLocalBlockheadWorkspace,
	} from '$/collections/localMutations.ts'
	import { getAppClient } from '$/routes/applicationClient.ts'


	// State
	let workspaceName = $state('')
</script>


<form
	data-card
	data-column="gap-3"
	onsubmit={async (event) => {
		event.preventDefault()
		const panelTreeId = `dashboard-${globalThis.crypto.randomUUID()}`
		const workspaceId = `workspace-${globalThis.crypto.randomUUID()}`
		await writeLocalBlockheadPanelTree(
			getAppClient(),
			{
				id: panelTreeId,
				workspaceId,
			}
		)
		await writeLocalBlockheadWorkspace(
			getAppClient(),
			{
				id: workspaceId,
				name: workspaceName,
				activePanelTreeId: panelTreeId,
			}
		)
		await writeLocalBlockheadPanel(
			getAppClient(),
			{
				treeId: panelTreeId,
				panelId: 'root',
				indexInParent: 0,
				kind: 'empty',
			}
		)
		await goto(resolve(
			'/~/dashboard/[dashboardId=stringSegment]',
			{
				dashboardId: panelTreeId,
			}
		))
	}}
>
	<header data-row="between wrap align-center gap-2">
		<h2>New dashboard</h2>
		<span data-text="annotation">Local draft</span>
	</header>

	<label for="workspace-name">Workspace name</label>

	<input
		id="workspace-name"
		name="workspaceName"
		bind:value={workspaceName}
		autocomplete="off"
		placeholder="Research board"
		required
	/>

	<button type="submit">Create dashboard</button>
</form>
