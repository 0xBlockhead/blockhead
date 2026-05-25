<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'


	// State
	let {
		children,
		Pending,
		Failed,
		boundaryKey = 'Boundary',
	}: {
		children?: Snippet
		Pending?: Snippet
		Failed?: Snippet<[
			error: unknown,
			retry: () => void,
		]>
		boundaryKey?: string
	} = $props()


	// State
	import { serializeError } from '$/lib/errors.ts'
	import { stringify } from '$/lib/json.ts'
</script>


<svelte:boundary
	onerror={(error) => {
		console.error('[blockhead:boundary:uncaught]', boundaryKey, error)
	}}
>
	{#if children}
		{@render children()}
	{/if}

	{#snippet pending()}
		{#if Pending}
			{@render Pending()}
		{:else}
			<div
				data-card
				data-row
				class="loading"
			>
				<p>
					Loading...
				</p>
			</div>
		{/if}
	{/snippet}

	{#snippet failed(
		error,
		retry
	)}
		<div
			data-card
			data-error={boundaryKey}
			role="alert"
		>
			{#if Failed}
				{@render Failed(
					error,
					retry,
				)}
			{:else}
				<div>
					<header data-row="wrap">
						<div
							data-row="start"
							data-row-item="flexible"
						>
							<p>
								{error instanceof Error ? error.name : 'Error'}
							</p>
						</div>

						<div
							data-row
						>
							<button
								type="button"
								onclick={() => navigator.clipboard.writeText(String(serializeError(error)))}
							>
								Copy
							</button>

							{#if retry}
								<button
									type="button"
									onclick={retry}
								>
									Retry
								</button>
							{/if}
						</div>
					</header>

					<div class="error-content">
						{#if error instanceof Error}
							<p class="error-message">{error.message}</p>

							{#if error.stack}
								<details class="error-stack">
									<summary>
										Stack trace
									</summary>
									<pre>{error.stack}</pre>
								</details>
							{/if}
						{:else}
							<pre>{stringify(error ?? null, null, 2)}</pre>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/snippet}
</svelte:boundary>


<style>
	.loading {
		cursor: wait;
	}

	.error-content {
		.error-message,
		pre {
			overflow: auto;
			min-width: 100%;
			width: 0;
		}

		pre {
			font-size: smaller;
		}
	}

	:global(body.svelte-inspector-enabled) {
		div {
			pointer-events: none;
		}
	}
</style>
