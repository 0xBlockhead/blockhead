<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'

	import type { QueryResourceError } from '$/lib/db/queryResource.svelte.ts'
	import { normalizeBoundaryError } from '$/lib/errors.ts'


	// State
	let {
		children,
		Pending,
		Failed,
		failure,
		boundaryKey = 'Boundary',
	}: {
		children?: Snippet
		Pending?: Snippet
		Failed?: Snippet<[
			error: QueryResourceError,
			retry?: () => void,
		]>
		failure?: {
			error: unknown
		}
		boundaryKey?: string
	} = $props()

	let copyResult = $state<{
		errorDetails: string
		copied: boolean
	}>()

	import { serializeError } from '$/lib/errors.ts'
	import { stringify } from '$/lib/json.ts'
</script>


<svelte:boundary
	onerror={(error: unknown) => {
		console.error('[blockhead:boundary:uncaught]', boundaryKey, normalizeBoundaryError(error))
	}}
>
	{#if failure}
		{@render failed(failure.error)}
	{:else if children}
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
		error: unknown,
		retry?: () => void
	)}
		{@const normalizedError = normalizeBoundaryError(error)}
		{@const errorDetails = String(serializeError(normalizedError))}
		<div
			data-card
			data-error={boundaryKey}
			role="alert"
		>
			{#if Failed}
				{@render Failed(
					normalizedError,
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
								onclick={async () => {
									try {
										await navigator.clipboard.writeText(errorDetails)
										copyResult = {
											errorDetails,
											copied: true,
										}
									} catch {
										copyResult = {
											errorDetails,
											copied: false,
										}
									}
								}}
							>
								Copy error details
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

					{#if copyResult?.errorDetails === errorDetails}
						<p role="status">
							{copyResult.copied ? 'Error details copied.' : 'Unable to copy error details. Select the error text to copy it manually.'}
						</p>
					{/if}

					<div class="error-content">
						{#if normalizedError instanceof Error}
							<p class="error-message">{normalizedError.message}</p>

							{#if normalizedError.stack}
								<details class="error-stack">
									<summary>
										Stack trace
									</summary>
									<pre>{normalizedError.stack}</pre>
								</details>
							{/if}
						{:else}
							<pre>{stringify(normalizedError ?? null, null, 2)}</pre>
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
